---
title: 一起学习机器学习（11）：K-means 与层次聚类
date: '2024-03-26 21:03:38'
updated: '2024-03-26 21:03:38'
abbrlink: a45ff8db
description: 学习 K-means 与层次聚类，结合距离计算、簇中心更新和 linkage 比较不同聚类方法。
categories:
- 软件
- 机器学习
tags:
- 机器学习
- Python
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/137057464
source_title: 11. 一起学习机器学习 Kmeans + Hierarchical Clustering
katex: true
series: 一起学习机器学习
---

> 这组文章整理自 2024 年的课程学习笔记，保留原练习、代码和图表。运行前请先看系列目录中的环境与数据说明。 [查看系列目录](/series/machine-learning/)。

<a id="outline"></a>

### <a id="t0"></a><a id="Outline_0"></a>Outline

- [Section 1](#section-1): K-means Clustering
- [Section 2](#section-2): Hierarchical Clustering

### <a id="t1"></a><a id="Introduction_7"></a>Introduction

The purpose of this notebook is to understand and implement two popular unsupervised learning methods to cluster data points.



```python
# imports
import numpy as np
import numpy.testing as npt # for testing.
import logging # debugging.
from tqdm.notebook import tqdm # progress

import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs

# Initial global configuration for matplotlib
SMALL_SIZE = 12
MEDIUM_SIZE = 16
BIGGER_SIZE = 20

plt.rc('font', size=SMALL_SIZE)          # controls default text sizes
plt.rc('axes', titlesize=SMALL_SIZE)     # fontsize of the axes title
plt.rc('axes', labelsize=MEDIUM_SIZE)    # fontsize of the x and y labels
plt.rc('xtick', labelsize=SMALL_SIZE)    # fontsize of the tick labels
plt.rc('ytick', labelsize=SMALL_SIZE)    # fontsize of the tick labels
plt.rc('legend', fontsize=SMALL_SIZE)    # legend fontsize
plt.rc('figure', titlesize=BIGGER_SIZE)  # fontsize of the figure title
```



We generate data with the `make_blobs` function. Although clustering methods are commonly used in unsupervised learning settings where no label *y* (cluster assignments) is available, we generate synthetic data with ground truth clusters for comparison later.

The number of dimensions can be specified by `n_features` in the function below. To simplify our setting, we will only consider data points in 3-dimensional space but these methods can also be used in higher dimensions and you are encouraged to try out these scenarios.



```python
# generate data
X, cluster_assignment = make_blobs(n_samples=400, n_features=3, centers=5,
                                   cluster_std=1.2,
                                   random_state=5, center_box=(0, 20))
```



`cluster_assignment` is the ground-truth that represents the true membership of each point to one of the three clusters. In practice we do not have it and we aim to **discover** these assignments without having any access to a train-split with given labels (as we do in supervised learning).



```python
# Visualize the 3D data
fig = plt.figure(figsize=(12, 8))
ax1, ax2 = fig.add_subplot(121, projection='3d'), fig.add_subplot(122, projection='3d')

ax1.scatter(X[:, 0], X[:, 1], X[:, 2],  alpha=0.7)
ax1.set_title('Input Data')
ax1.set_xticklabels([]); ax1.set_yticklabels([]); ax1.set_zticklabels([]);
ax1.set_xlabel('X1'); ax1.set_ylabel('X2'); ax1.set_zlabel('X3')

ax2.scatter(X[:, 0], X[:, 1], X[:, 2], alpha=0.7,
           # We use cluster_assignment only to visualize the ground-truth
           # (the ideal clustering) in practice we don't have it and aim to estimate y.
           c=cluster_assignment)
ax2.set_title('Ground-Truth Assignments (Unknown)')
ax2.set_xticklabels([]); ax2.set_yticklabels([]); ax2.set_zticklabels([]);
ax2.set_xlabel('X1'); ax2.set_ylabel('X2'); ax2.set_zlabel('X3');

# Show the plot
plt.show()
```



​  
 ![外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传](/images/migrated/b02ab9d6dde970913267.jpg)  
 ​

<a id="section-1"></a>

## <a id="t2"></a><a id="Section_1_kmeans_Clustering_indexoutline_81"></a>Section 1: {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-means Clustering ([index](#outline))

{% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-means is a simple clustering algorithm that follows the following steps:

1. Given a number of clusters {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}, assign every sample to one of the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-clusters at random.
2. Compute the centroid of each of the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}- clusters:  
    {% raw %}<span class="katex-display"><span class="katex"><span class="katex-mathml">
      
       
        
         
          
           m
          
          
           l
          
         
         
          =
         
         
          
           1
          
          
           
            ∣
           
           
            
             c
            
            
             l
            
           
           
            ∣
           
          
         
         
          
           ∑
          
          
           
            i
           
           
            ∈
           
           
            
             c
            
            
             l
            
           
          
         
         
          
           x
          
          
           i
          
         
         
          ,
         
         
         
          l
         
         
          =
         
         
          1
         
         
          ,
         
         
          …
         
         
          ,
         
         
          k
         
        
        
         \boldsymbol{m}_l = \frac{1}{|c_l|} \sum_{i \in c_l} \boldsymbol{x}_i, \quad l=1, \ldots, k
        
       
      </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.5944em; vertical-align: -0.15em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">m</span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3361em;"><span class="" style="top: -2.55em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 2.705em; vertical-align: -1.3835em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.3214em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord">∣</span><span class="mord"><span class="mord mathnormal">c</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3361em;"><span class="" style="top: -2.55em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mord">∣</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.936em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.05em;"><span class="" style="top: -1.8723em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">∈</span><span class="mord mtight"><span class="mord mathnormal mtight">c</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3448em;"><span class="" style="top: -2.3488em; margin-left: 0em; margin-right: 0.0714em;"><span class="pstrut" style="height: 2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1512em;"><span class=""></span></span></span></span></span></span></span></span></span><span class="" style="top: -3.05em;"><span class="pstrut" style="height: 3.05em;"></span><span class=""><span class="mop op-symbol large-op">∑</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.3835em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">x</span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right: 1em;"></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord mathnormal" style="margin-right: 0.0197em;">l</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 0.8889em; vertical-align: -0.1944em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="minner">…</span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mpunct">,</span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}
3. Reassign each {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         
          x
         
         
          i
         
        
       
       
        \boldsymbol{x}_i
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.5944em; vertical-align: -0.15em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">x</span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span></span></span></span></span>{% endraw %} to the closest centroid.
4. Repeat step (2) and (3) until:
   - Assignments/labels do not change, or
   - the within-distance {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
       
        
         
          
           W
          
          
           (
          
          
           C
          
          
           )
          
         
         
          W(C)
         
        
       </span><span class="katex-html"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">W</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right: 0.0715em;">C</span><span class="mclose">)</span></span></span></span></span>{% endraw %} converges, wich is defined as:  
      {% raw %}<span class="katex-display"><span class="katex"><span class="katex-mathml">
        
         
          
           
            
             1
            
            
             2
            
           
           
            
             ∑
            
            
             
              l
             
             
              =
             
             
              1
             
            
            
             k
            
           
           
            
             1
            
            
             
              ∣
             
             
              
               c
              
              
               l
              
             
             
              ∣
             
            
           
           
            
             ∑
            
            
             
              i
             
             
              ,
             
             
              j
             
             
              ∈
             
             
              
               c
              
              
               l
              
             
            
           
           
            ∣
           
           
            ∣
           
           
            
             x
            
            
             
              (
             
             
              i
             
             
              )
             
            
           
           
            −
           
           
            
             x
            
            
             
              (
             
             
              j
             
             
              )
             
            
           
           
            ∣
           
           
            
             ∣
            
            
             2
            
           
          
          
           \frac{1}{2} \sum_{l=1}^k \frac{1}{|c_l|}\sum_{i, j \in c_l}||\boldsymbol{x}^{(i)} - \boldsymbol{x}^{(j)}||^2
          
         
        </span><span class="katex-html"><span class="base"><span class="strut" style="height: 3.2499em; vertical-align: -1.4138em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.3214em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord">2</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.686em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.8361em;"><span class="" style="top: -1.8479em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span class="" style="top: -3.05em;"><span class="pstrut" style="height: 3.05em;"></span><span class=""><span class="mop op-symbol large-op">∑</span></span></span><span class="" style="top: -4.3em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0315em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.3021em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.3214em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord">∣</span><span class="mord"><span class="mord mathnormal">c</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3361em;"><span class="" style="top: -2.55em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mord">∣</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.936em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.05em;"><span class="" style="top: -1.8723em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mpunct mtight">,</span><span class="mord mathnormal mtight" style="margin-right: 0.0572em;">j</span><span class="mrel mtight">∈</span><span class="mord mtight"><span class="mord mathnormal mtight">c</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3448em;"><span class="" style="top: -2.3488em; margin-left: 0em; margin-right: 0.0714em;"><span class="pstrut" style="height: 2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1512em;"><span class=""></span></span></span></span></span></span></span></span></span><span class="" style="top: -3.05em;"><span class="pstrut" style="height: 3.05em;"></span><span class=""><span class="mop op-symbol large-op">∑</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.4138em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord">∣∣</span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">x</span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.938em;"><span class="" style="top: -3.113em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight">i</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.2222em;"></span></span><span class="base"><span class="strut" style="height: 1.188em; vertical-align: -0.25em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">x</span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.938em;"><span class="" style="top: -3.113em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight" style="margin-right: 0.0572em;">j</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span><span class="mord">∣</span><span class="mord"><span class="mord">∣</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8641em;"><span class="" style="top: -3.113em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>{% endraw %}
   - or, **optionally**, the number of iterations exceeds a predefined number `max_iters`.

By applying this algorithm to the dataset generated above, we expect the following clustering trajectory:

![kmeans](/images/migrated/2d73bb782177fa754f12.gif)

To implement the 4-step k-means algorithm we develop some useful subroutines:

- `compute_centroids`: from samples and their assignments, return the corresponding centroids (for step 2).
- `compute_within_distance`: from centroids, samples, and their assignments, compute the within-distance (used for step 4 convergence check).
- `kmeans_assignments`: from centroids and samples, return the new assignments (for step 3)

In `kmeans_assignments` and `compute_within_distance` functions, we need to consider an edge case. It is possible that the new cluster assignments miss out one of centroids, which means that we now have an empty cluster, or equivalently, we have two clusters accidentally collided to one cluster. The computed centroids in the next iteration will be `NaN`, which is a special numerical value to encode missingness, or a problematic result. We need to handle the `NaN` centroid carefully in `kmeans_assignments` and `compute_within_distance`.

Now we implement `compute_within_distance`. An equivalent formulation of {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        W
       
       
        (
       
       
        C
       
       
        )
       
      
      
       W(C)
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">W</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right: 0.0715em;">C</span><span class="mclose">)</span></span></span></span></span>{% endraw %} (page 103 in the notes), can be written as:

{% raw %}<span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         W
        
        
         (
        
        
         C
        
        
         )
        
        
         =
        
        
         
          ∑
         
         
          
           l
          
          
           =
          
          
           1
          
         
         
          k
         
        
        
         
          ∑
         
         
          
           i
          
          
           ∈
          
          
           
            c
           
           
            l
           
          
         
        
        
         ∣
        
        
         ∣
        
        
         
          x
         
         
          
           (
          
          
           i
          
          
           )
          
         
        
        
         −
        
        
         
          m
         
         
          l
         
        
        
         ∣
        
        
         
          ∣
         
         
          2
         
        
       
       
         W(C) = \sum_{l=1}^k \sum_{i \in c_l} ||\boldsymbol{x}^{(i)} - \boldsymbol{m}_l||^2 
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">W</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right: 0.0715em;">C</span><span class="mclose">)</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 3.2196em; vertical-align: -1.3835em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.8361em;"><span class="" style="top: -1.8479em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span class="" style="top: -3.05em;"><span class="pstrut" style="height: 3.05em;"></span><span class=""><span class="mop op-symbol large-op">∑</span></span></span><span class="" style="top: -4.3em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0315em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.3021em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.05em;"><span class="" style="top: -1.8723em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">∈</span><span class="mord mtight"><span class="mord mathnormal mtight">c</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3448em;"><span class="" style="top: -2.3488em; margin-left: 0em; margin-right: 0.0714em;"><span class="pstrut" style="height: 2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1512em;"><span class=""></span></span></span></span></span></span></span></span></span><span class="" style="top: -3.05em;"><span class="pstrut" style="height: 3.05em;"></span><span class=""><span class="mop op-symbol large-op">∑</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.3835em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord">∣∣</span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">x</span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.938em;"><span class="" style="top: -3.113em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight">i</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.2222em;"></span></span><span class="base"><span class="strut" style="height: 1.1141em; vertical-align: -0.25em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">m</span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3361em;"><span class="" style="top: -2.55em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mord">∣</span><span class="mord"><span class="mord">∣</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8641em;"><span class="" style="top: -3.113em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>{% endraw %}

where {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         m
        
        
         l
        
       
      
      
       \boldsymbol{m}_l
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.5944em; vertical-align: -0.15em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol">m</span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3361em;"><span class="" style="top: -2.55em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0197em;">l</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span></span></span></span></span>{% endraw %} denotes the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        l
       
      
      
       l
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0197em;">l</span></span></span></span></span>{% endraw %}-th cluster centroid.



```python
# EDIT THIS FUNCTION
def compute_within_distance(centroids, X, labels):
    """
    Compute the within-cluster distance.

    Args:
        centroids (np.ndarray): the centroids array, with shape (k, p).
        X (np.ndarray): the samples array, with shape (N, p).
        labels (np.ndarray): the cluster index of each sample, with shape (N,).

    Retruns:
        (float): the within-cluster distance.
    """
    within_distance = 0.0
    k, p = centroids.shape

    for l in range(len(centroids)):
        centroid = centroids[l]
        # Applying aggregate computations on `NaN` values
        # can propagate the `NaN` to the results.
        # In this case we skip the `NaN` centroid,
        # which is effectively of an empty cluster.
        if np.isnan(centroid).any():
            continue

        # Select samples belonging to label=l.
        X_cluster = X[labels == l]

        # EDIT THE NEXT LINES
        # You need to add the `X_cluster` contribution to `within_distance`

        # 1. Compute the cluster contribution.
        cluster_se = (X_cluster - centroid)**2 # <-- SOLUTION
        assert cluster_se.shape == (len(X_cluster), p) # <-- SOLUTION
        # 2. Accumulate
        within_distance += np.sum(cluster_se) # <-- SOLUTION

    return within_distance
```



Now implement `compute_centroids` that we use in step 2.



```python
# EDIT THIS FUNCTION
def compute_centroids(k, X, labels):
    """
    Compute the centroids of the clustered points X.

    Args:
        k (int): total number of clusters.
        X (np.ndarray): data points, with shape (N, p)
        labels (np.ndarray): cluster assignments for each sample in X, with shape (N,).

    Returns:
        (np.ndarray): the centroids of the k clusters, with shape (k, p).
    """
    N, p = X.shape

    centroids = np.zeros((k, p))

    # EDIT THE NEXT LINES
    for label in range(k):
        cluster_X_l = X[labels == label] # <-- SOLUTION
        centroids[label] = cluster_X_l.mean(axis=0) # <-- SOLUTION

    return centroids
```



Make sure the following simple test case runs successfully.



```python
# Test case.
X_test = np.array([[1, 1, 0],
                    [2, 2, 1],
                    [5, 3, 4],
                    [8, 3, 2]])
labels = np.array([0, 0, 1, 1])

centroids = np.array([[1.5, 1.5, 0.5],
                      [6.5, 3, 3]])

# Test compute_centroids
npt.assert_allclose(compute_centroids(2, X_test, labels),  centroids)


# Test compute_within_distance.
npt.assert_allclose(compute_within_distance(centroids, X_test, labels), 8.0)
```



Now, to the subroutine `kmeans_assignments`.



```python
# EDIT THIS FUNCTION
def kmeans_assignments(centroids, X):
    """
    Assign every example to the index of the closest centroid.

    Args:
        centroids (np.ndarray): The centroids of the k clusters, shape: (k, p).
        X (np.ndarray): The samples array, shape (N, p).

    Returns:
        (np.ndarray): an assignment matrix to k clusters, by their indices.
    """
    k, p = centroids.shape
    N, _ = X.shape

    # Compute distances between data points and centroids. Assumed shape: (k, N).
    distances = np.vstack([np.linalg.norm(X - c, axis=1) for c in centroids]) # <-- SOLUTION
    # Note: If any centroid has NaN, the NaN value will propagate into the
    # distance corresponding row, we need to skip that row next when we search
    # for the closest centroid.

    assert distances.shape == (k, N), f"Unexpected shape {distances.shape} != {(k, N)}"
    # Assignments are computed by finding the centroid with the minimum distance
    # for each sample. The np.nanargmin returns the index of the minimum values
    # in `distances` scanning the rows (axis=0) for each column,
    # while skipping any nan value found.
    return np.nanargmin(distances, axis=0)
```



Some test cases to pass.



```python
# Test case.
X_test = np.array([[1, 1, 0],
                    [2, 2, 1],
                    [5, 3, 4],
                    [8, 3, 2],
                    [11,4, -1]])

labels = np.array([0, 0, 1, 1, 1])

centroids = np.array([[1.5, 1.5, 0.5],
                      [6.5, 3, 3]])

# Test kmeans_assignments
npt.assert_equal(kmeans_assignments(centroids, X_test),  labels)
```



We are ready to implement `kmeans_clustering` that builds on the previous subroutines.



```python
# EDIT THIS FUNCTION
def kmeans_clustering(X, k,
                      max_iters=1000,
                      epsilon=0.0,
                      callback=None):
    """
    Apply k-means clustering algorithm on the samples in `X` to generate
    k clusters.

    Notes:
      The main steps followed here are described previously:
        1. randomly assignments of the points to $k$-clusters.
        2. compute the centroid of each of the $k$- clusters.
        3. reassign each point to the closest centroid.
        4. repeat steps (2) and (3) until:
            - assignments/labels do not change, or
            - the within-distance $W(C)$ converges with `epsilon` tolerence.
            - or the number of iterations exceeds `max_iters`.


    Args:
        X (np.ndarray): The samples array, shape: (N, p).
        k (int): The number of clusters.
        max_iters (int): Maximum number of iterations.
        epsilon (float): The minimum change in the within-distance to continue.
        callback (Callable): a function to be called on the assignments,
            the centroids, and within-distance after each iteration, default is None.

    Returns:
        Tuple[np.ndarray, np.ndarray]: the assignments array to k clusters with
            shape (N,) and the centroids array
    """
    # Step 1: randomly initialise the cluster assignments.
    labels = np.random.choice(k, size=len(X), replace=True) # <-- SOLUTION

    within_distance = np.inf

    for _ in range(max_iters):
        # Step 2: compute the centroids
        centroids = compute_centroids(k, X, labels) # <-- SOLUTION

        if callback:
            callback(labels, centroids)

        # Step 3: reassignments.
        new_labels = kmeans_assignments(centroids, X) # <-- SOLUTION

        _within_distance = compute_within_distance(centroids, X, labels)

        # Step 4: repeat (2) and (3) until a termination condition.
        if all(labels == new_labels) or abs(_within_distance - within_distance) < epsilon: # <-- SOLUTION
            break

        labels = new_labels
        within_distance = _within_distance


    return labels, centroids, within_distance
```



We are now ready to apply {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-means clustering to our synthetic data. While choosing the right {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} is difficult in real world applications and there a many different heuristics (see lecture notes), we simply choose {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
       
        =
       
       
        5
       
      
      
       k=5
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 0.6444em;"></span><span class="mord">5</span></span></span></span></span>{% endraw %} for demonstration purposes as we have 5 ground-truth clusters.



```python
max_iters = 100
epsilon = 0
k = 5

intermediates = []
# Our callback stores all the intermediate labels and centroids
# in case we need them for debugging and visualisations.
callback = lambda labels, centroids: intermediates.append((labels, centroids))

labels, centroids, wd = kmeans_clustering(X, k=k, max_iters=max_iters,
                                        epsilon=epsilon,
                                        callback=callback)
```




```
/tmp/ipykernel_14591/1736973285.py:21: RuntimeWarning: Mean of empty slice.
  centroids[label] = cluster_X_l.mean(axis=0) # <-- SOLUTION
/home/ec2-user/anaconda3/envs/tensorflow2_p310/lib/python3.10/site-packages/numpy/core/_methods.py:121: RuntimeWarning: invalid value encountered in divide
  ret = um.true_divide(
```




```python
# `intermediates` list is now populated with the clustering trajectory.
len(intermediates)
```




```
6
```



Now we often observe by executing the cell above several times the following warning message `RuntimeWarning: Mean of empty slice.`. This message means that one of the centroids is not selected by any point, so the next iteration we compute the centroids, one of them is computed by applying `np.mean(X_cluster, axis=0)`, while `X_cluster` is an empty array, which results in a vector of `NaN` values as the new centroid.

One way to address this problem, without changing the functions above, is to apply the `kmeans_clustering` multiple times since different initialisation results in different intermediate clustering, from which we may obtain a clustering trajectory without the empty cluster issue. This also gives us an opportunity to select the best clustering among different initialisations using the *within-cluster* distance as a selection metric. As we will see, clustering with fewer {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} clusters have in general higher *within-cluster* distance, so choosing the clustering with minimum *within-cluster* distance will result in the clustering with the highest separation quality as well as excluding clustering with empty clusters (that are effectively with a number of clusters {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         k
        
        
         ′
        
       
       
        &lt;
       
       
        k
       
      
      
       k' &lt; k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.791em; vertical-align: -0.0391em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.7519em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}).



```python
# EDIT THIS FUNCTION
def kmeans_clustering_multi_runs(X, k, max_iters=100,
                                 epsilon=0.0,
                                 n_runs=100, seed=0):
    """
    Perform multiple runs (with different initialisations) of kmeans algorithm
    and return the best clustering using the within-cluster distance.

    Args:
        X (np.ndarray): The samples array, shape (N, p).
        k (int): The number of clusters.
        max_iters (int): Maximum iterations of kmeans algorithm.
        epsilon (float): The convergence threshold of kmeans algorithm.
        n_runs (int): The number of runs of kmeans with different initialisations.
        seed (int): A seed value before starting the n_runs loop.

    Returns:
        Tuple[np.ndarray, ...]: A tuple that encapsulates (labels, centroids,
        intermediate clustering, within-cluster distance) of the best clusetering
        that minimises the within-cluster distance along the n_runs.
    """
    # We fix the seed once before starting the n_runs.
    np.random.seed(seed)
    min_within_distance = np.inf
    best_clustering = (None, None, None)

    for _ in range(n_runs):
        intermediates = []
        # Our callback stores all the intermediate labels and centroids
        # in case we need them for debugging and visualisations.
        callback = lambda labels, centroids: intermediates.append((labels, centroids))

        labels, centroids, wd = kmeans_clustering(X, k=k, max_iters=max_iters,
                                                    epsilon=epsilon,
                                                    callback=callback) # <-- SOLUTION

        if wd < min_within_distance:
            best_clustering = labels, centroids, intermediates
            min_within_distance = wd

    labels, centroids, intermediates = best_clustering
    return labels, centroids, intermediates, wd
```




```python
labels, centroids, intermediates, wd = kmeans_clustering_multi_runs(X, 5)
```




```
/tmp/ipykernel_14591/1736973285.py:21: RuntimeWarning: Mean of empty slice.
  centroids[label] = cluster_X_l.mean(axis=0) # <-- SOLUTION
```




```python
i = len(intermediates) - 1
labels, centroids = intermediates[i]

# Visualize the 3D data
fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')

ax.scatter(X[:, 0], X[:, 1], X[:, 2],
           c=labels, s=10, alpha = 0.5)
centroid_scatter = ax.scatter(centroids[:, 0], centroids[:, 1], centroids[:, 2],
                    alpha=1.0, marker='X', edgecolor='r',
                    c=np.arange(len(centroids)), s=100)


ax.set_title(f'Clustering (k={len(centroids)}) @iteration:{i}')
ax.set_xticklabels([]); ax.set_yticklabels([]); ax.set_zticklabels([]);
ax.set_xlabel('X1'); ax.set_ylabel('X2'); ax.set_zlabel('X3');

plt.legend(handles=centroid_scatter.legend_elements()[0],
           labels=[f'Centroid:{i}' for i in range(len(centroids))],
           loc='upper left', numpoints=1, ncol=3, fontsize=8, bbox_to_anchor=(0, 0))

plt.show()
```



​  
 ![请添加图片描述](/images/migrated/546ec9e4d2f346f0e287.png)

​

To visualize the intermediate clustering we take a snapshot at every iteration and then compile them into a GIF animated plot.



```python
import matplotlib.animation as animation

fig = plt.figure(figsize=(12, 8));
ax = fig.add_subplot(111, projection='3d');
def update_plot(i):
    # clear the axis each frame
    ax.clear();
    labels, centroids = intermediates[i]

    ax.set_xticklabels([]); ax.set_yticklabels([]); ax.set_zticklabels([]);
    ax.set_xlabel('X1'); ax.set_ylabel('X2'); ax.set_zlabel('X3');
    ax.set_title(f'Clustering (k={len(centroids)}) @iteration:{i}');
    ax.scatter(X[:, 0], X[:, 1], X[:, 2],
               c=labels, s=10, alpha = 0.5);
    centroid_scatter = ax.scatter(centroids[:, 0], centroids[:, 1], centroids[:, 2],
                alpha=1.0, marker='X', edgecolor='r',
                c=np.arange(len(centroids)), s=100);
    ax.legend(handles=centroid_scatter.legend_elements()[0],
               labels=[f'Centroid:{i}' for i in range(len(centroids))],
               loc='upper left', numpoints=1, ncol=3, fontsize=8, bbox_to_anchor=(0, 0))

ani = animation.FuncAnimation(fig, update_plot,
                              frames=len(intermediates),
                              interval=1000);

# Save it as a GIF file in the current directory and open it.
ani.save(f'kmeans_k{k}.gif', writer='pillow');

plt.clf()
```




```
<Figure size 1200x800 with 0 Axes>
```



##### <a id="Questions_507"></a>Questions

1. Change the value for {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} and observe how this changes the clustering.
2. How could you find the best {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} without using the knowledge that the number of ground truth clusters is 5?
3. Also change the value of the `random_state` or set it to `None` in the data-generating function. Is the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-means algorithm good in finding overlapping clusters?

<a id="section-2"></a>

## <a id="t3"></a><a id="Section_2_Hierarchical_Clustering_indexoutline_515"></a>Section 2: Hierarchical Clustering ([index](#outline))

One version of hierarchical clustering is the so called *agglomerative clustering*. In agglomerative clustering, we start by considering each of the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        N
       
      
      
       N
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.109em;">N</span></span></span></span></span>{% endraw %} examples as a separate cluster. The algorithm then proceeds to merge pairs of clusters starting with the pair that achieves a minimum linkage criterion, and successively repeats the merging of clusters until we end up with one big cluster comprising all the data points. With applying this scheme on our dataset we expect the following clustering trajectory.

![agglomerative](/images/migrated/359b1860049627c8f87b.gif)

#### <a id="t4"></a><a id="Pairwise_distances_523"></a>Pairwise distances

Now let’s define a function that returns a Numpy array storing the euclidean distances between every two points in `X`.



```python
## EDIT THIS FUNCTION
def pairwise_distances(points):
    '''
    Args:
        points (np.ndarray): A numpy array of points having the shape (N, p),
          where N is the number of points and p is the number of features.
    Returns:
        (np.ndarray) A numpy array with shape (N, N) such that the element (i, j) is the computed
        distance between i-th point and j-th point in X.
    '''
    N, D = points.shape
    distance = np.empty((N, N))

    # Distance matrix will be symmetric, so maybe avoid redundant computations.
    # ADD LINES BELOW: to populate `distance` with the pairwise distances.
    for i in range(N):
        distance[i, i] = 0
        for j in range(i + 1, N):
            d = np.sqrt(np.sum((points[i, :] - points[j, :])**2))    # <-- SOLUTION
            distance[i, j] = d
            distance[j, i] = d

    return distance
```




```python
d = pairwise_distances(X)
```



You implementation should pass the following simple test case



```python
X_test = np.array([[-3, -4],
                   [0 , 0],
                   [3 , 4]])

npt.assert_allclose(pairwise_distances(X_test),
                    np.array([[0, 5, 10],
                              [5, 0, 5],
                              [10, 5, 0]]))
```



#### <a id="t5"></a><a id="Linkage_573"></a>Linkage

In the following, we are going to implement the agglomerative algorithm with three different *linkage* criteria, as listed in the notes:

1. Simple Linkage: a simple linkage between two clusters is the minimum distance between any pair of points from the two clusters.
2. Complete Linkage: a complete linkage between two clusters is the maximum distance between any pair of points from the two clusters.
3. Average Linkage: an average linkage between two clusters is the average distance over all pairs of points from the two clusters.

We start by implementing subroutines for computing the three linkage criteria:



```python
## EDIT THIS CELL

def single_linkage(distances, cluster_assignment, i, j):
    """
    This function computes the single linkage value between two clusters.
    Args:
      distances (np.ndarray): A numpy array of pair-wise distances for the given points, shape (N, N).
      cluster_assignment (np.ndarray): A numpy array that assigns a cluster id for every point, shape (N,).
      i (int): the first cluster id.
      j (int): the second cluster id.
    Returns:
      (float): The minimum distance between the two given clusters.
    """
    # Select the point indices of the first cluster.
    points_i = np.argwhere(cluster_assignment == i) ## <-- SOLUTION
    # Select the point indices of the second cluster.
    points_j = np.argwhere(cluster_assignment == j) ## <-- SOLUTION
    # Form a cartesian product between the indices in i and indices in j.
    pairs = np.array([[element_i.item(), element_j.item()]  for element_i in points_i for element_j in points_j])
    # Select the pair distances between the points in the two clusters from the distances matrix.
    pairs_distance = distances[pairs[:, 0], pairs[:, 1]]
    # Return the minimum
    return pairs_distance.min()    # <-- SOLUTION

def complete_linkage(distances, cluster_assignment, i, j):
    """
    This function computes the complete linkage value between two clusters.
    Args:
      distances (np.ndarray): A numpy array of pair-wise distances for the given points.
      cluster_assignment (np.ndarray): A 1-D numpy array that assigns a cluster id for every point.
      i (int): the first cluster id.
      j (int): the second cluster id.
    Returns:
      (float): The maximum distance between the two given clusters.
    """
    # Select the point indices of the first cluster.
    points_i = np.argwhere(cluster_assignment == i) ## <-- SOLUTION
    # Select the point indices of the second cluster.
    points_j = np.argwhere(cluster_assignment == j) ## <-- SOLUTION
    # Form a cartesian product between the indices in i and indices in j.
    pairs = np.array([ [element_i.item(), element_j.item()]  for element_i in points_i for element_j in points_j])
    # Select the pair distances between the points in the two clusters from the distances matrix.
    pairs_distance = distances[pairs[:, 0], pairs[:, 1]]
    # Return the maximum
    return pairs_distance.max()    # <-- SOLUTION


def average_linkage(distances, cluster_assignment, i, j):
    """
    This function computes the average linkage value between two clusters.
    Args:
      distances (np.ndarray): A numpy array of pair-wise distances for the given points.
      cluster_assignment (np.ndarray): A 1-D numpy array that assigns a cluster id for every point.
      i (int): the first cluster id.
      j (int): the second cluster id.
    Returns:
      (float): The average distance between the two given clusters.
    """
    # Select the point indices of the first cluster.
    points_i = np.argwhere(cluster_assignment == i) ## <-- SOLUTION
    # Select the point indices of the second cluster.
    points_j = np.argwhere(cluster_assignment == j) ## <-- SOLUTION
    # Form a cartesian product between the indices in i and indices in j.
    pairs = np.array([[element_i.item(), element_j.item()]  for element_i in points_i for element_j in points_j])
    # Select the pair distances between the points in the two clusters from the distances matrix.
    pairs_distance = distances[pairs[:, 0], pairs[:, 1]]
    # Return the average
    return pairs_distance.mean()    # <-- SOLUTION
```



We are now ready to implement the agglomerative hierarchical clustering algorithm.



```python
## EDIT THIS FUNCTION
def hierarchical_clustering(points, distances, linkage):
    """
    The agglomerative hierarchical clustering algorithm start with every point as a single
    cluster and each iteration merges two clusters into one. We may wish to store all the
    intermediate clustering results with respect to the number of clusters left.

    Args:
     points: A numpy array of points having the shape (N, D),
          where N is the number of points and D is the number of features.
     distances: A numpy array with shape (N, N) such that the element (i, j) is the computed
        distance between i-th point and j-th point in X.
     linkage: A linkage function from the above to call to compute the linkage values between two clusters.

    Returns:
     (np.ndarray):  A numpy array of shape (N, N) of which each row stores the clustering assignment at each level.
     The first row, i.e. a[0, :], represents the highest level of clustering where all columns have the same index value.
     The second row, i.e. a[1, :], represents all the points assigned into two cluster indices.
     The last row, i.e. a[N - 1, :], represents the points assigned into N - 1 cluster indices.
    """
    N, D = points.shape
    assignments = np.zeros((N, N))

    # Begin with every point in its own cluster
    current_assignment = np.arange(N)   # <-- SOLUTION

    # The id to be assigned for the next merged cluster
    next_cluster_id = N

    # Begin from level (N - 1) to level 1
    for level in tqdm(range(N - 1, 0, -1)):

        cluster_ids = np.unique(current_assignment)

        min_d = np.inf

        # Initialize the cluster ids to be merged in this iteration.
        cluster_a, cluster_b = (-1, -1)

        # Now find the two clusters that have the minimum distance in between.
        for i in range(cluster_ids.size):   # <-- SOLUTION
            for j in range(i + 1, cluster_ids.size):    # <-- SOLUTION
                cluster_i = cluster_ids[i]  # <-- SOLUTION
                cluster_j = cluster_ids[j]  # <-- SOLUTION
                d = linkage(distances, current_assignment, cluster_i, cluster_j)    # <-- SOLUTION
                if d < min_d:   # <-- SOLUTION
                    min_d = d   # <-- SOLUTION
                    cluster_a, cluster_b = (cluster_i, cluster_j)   # <-- SOLUTION


        # Merge the two clusters
        current_assignment[(current_assignment == cluster_a) | (current_assignment == cluster_b)] = next_cluster_id # <-- SOLUTION

        next_cluster_id += 1
        # Store the current cluster assignment into the assignments array.
        assignments[level, :] = current_assignment

    return assignments
```



We can now apply hierarchical clustering to our synthetic data.



```python
a = hierarchical_clustering(X, d, average_linkage)
```




```
  0%|          | 0/399 [00:00<?, ?it/s]
```



Similarly to {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-means clustering it is not easy to choose the best level in the dendrogram of hierarchical clustering. As we know that our data has 5 ground-truth clusters, we visualise level 5 below.



```python
level = 5

level_vals = list(sorted(set(a[level])))
simple_labels = [level_vals.index(v) for v in a[level]]

# Visualize the 3D data
fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')

ax.scatter(X[:, 0], X[:, 1], X[:, 2],
           c=simple_labels, s=10, alpha = 0.9)


ax.set_title(f'Hierarchical Clustering (level={level})')
ax.set_xticklabels([]); ax.set_yticklabels([]); ax.set_zticklabels([]);
ax.set_xlabel('X1'); ax.set_ylabel('X2'); ax.set_zlabel('X3');

plt.show()
```



![请添加图片描述](/images/migrated/5cf6411b3e3e0276299b.png)

To visualise the clustering at all levels we again produce an animation.



```python
import matplotlib.animation as animation
from matplotlib import cm
cmap_colors = cm.tab20.colors

fig = plt.figure(figsize=(12, 8));
ax = fig.add_subplot(111, projection='3d');

# Select levels to show.
levels = list(range(10)) + list(range(10, 100, 10))
levels = [l for l in levels if l < len(a)]
def update_plot(i):
    # clear the axis each frame
    ax.clear();
    level = levels[len(levels) - i - 1]
    level_clusters = a[level]

    colors = np.array([cmap_colors[int(l) % 20] for l in level_clusters])

    ax.set_xticklabels([]); ax.set_yticklabels([]); ax.set_zticklabels([]);
    ax.set_xlabel('X1'); ax.set_ylabel('X2'); ax.set_zlabel('X3');
    ax.set_title(f'Clustering @level:{level}');

    still_mask = (a[level] == a[min(level + 1, len(a) - 1)])
    ax.scatter(X[:, 0], X[:, 1], X[:, 2],
               c=colors, s=50, alpha = 0.7,
               linewidth=np.where(still_mask, 0, 2),
               edgecolor=np.where(still_mask, 'none', 'r'))


ani = animation.FuncAnimation(fig, update_plot,
                              frames=len(levels),
                              interval=1000);

# Save it as a GIF file in the current directory and open it.
ani.save(f'agglomerative_clustering_average_link.gif', writer='pillow');

plt.clf()
```



![请添加图片描述](/images/migrated/237a5e96d5c2b3936f45.gif)

##### <a id="Questions_802"></a>Questions

1. What are the inherent advantages of hierarchical clustering over {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-means?
2. Try out different linkage methods. Can you observe any differences? If so, where do these differences come from?
3. Can you replicate your results for both algorithms with sklearn?
4. Do both algorithms perform well on a [dataset of handwritten digits](https://scikit-learn.org/stable/datasets/toy_dataset.html#digits-dataset)?
