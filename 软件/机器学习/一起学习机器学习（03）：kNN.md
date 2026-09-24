---
title: 一起学习机器学习（03）：kNN
date: '2024-03-25 09:34:07'
updated: '2024-03-26 21:21:05'
abbrlink: a50c0a43
description: 从距离计算和邻居投票实现 kNN 分类，用交叉验证选择 k，再扩展到回归任务。
categories:
- 软件
- 机器学习
tags:
- 机器学习
- Python
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/137003241
source_title: 3.一起学习机器学习 - kNN
katex: true
series: 一起学习机器学习
---

> 这组文章整理自 2024 年的课程学习笔记，保留原练习、代码和图表。运行前请先看系列目录中的环境与数据说明。 [查看系列目录](/series/machine-learning/)。

##### <a id="Prerequisites_0"></a>Prerequisites

- Basic familiarity with [Numpy](https://numpy.org/doc/stable/user/quickstart.html)
- Basic familiarity with [Pyplot](https://matplotlib.org/stable/tutorials/introductory/pyplot.html)

<a id="outline"></a>

### <a id="t0"></a><a id="Outline_7"></a>Outline

- [Section 1](#section-1): Intro to kNN
- [Section 2](#section-2): Classification with kNN
- [Section 3](#section-3): Hyperparameter Tuning for {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         k
        
       
       
        k
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} with *T-fold* Cross Validation
- [Section 4](#section-4): Regression with kNN

## <a id="t1"></a><a id="_k__nearest_neighbours_kNN_15"></a>*k* nearest neighbours (kNN)

The purpose of this notebook is to understand and implement the kNN algorithm. You are not allowed to use any package that has a complete kNN framework implemented (e.g., scikit-learn).

<a id="section-1"></a>

### <a id="t2"></a><a id="Section_1_Intro_to_kNN_outline_21"></a>Section 1: Intro to kNN [^](#outline)

The kNN algorithm can be used both for classification and regression. Broadly speaking, it starts with calculating the distance of a given point {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        x
       
      
      
       x
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>{% endraw %} to all other points in the data set. Then, it finds the *k* nearest points closest to {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        x
       
      
      
       x
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>{% endraw %}, and assigns the new point {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        x
       
      
      
       x
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>{% endraw %} to the majority class of the *k* nearest points *(classification)*. So, for example, if two of the *k*=3 closest points to {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        x
       
      
      
       x
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>{% endraw %} were red while one is blue, {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        x
       
      
      
       x
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>{% endraw %} would be classified as red.

On the other hand in *regression*, we see the labels as continuous variables and assign the label of a data point {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        x
       
      
      
       x
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>{% endraw %} as the mean of the labels of its *k* nearest neighbours.



```python
import numpy as np
from sklearn.datasets import make_classification, fetch_california_housing
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
```



Important things first: You already know that the kNN algorithm is based on computing distances between data points. So, let’s start with defining a function that computes such a distance. For simplicity, we will only work with **Euclidean distances** in this notebook, but other distances can be chosen interchangably, of course.

Implement in the following cell the Euclidean distance {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        d
       
      
      
       d
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal">d</span></span></span></span></span>{% endraw %}, defined as  
 {% raw %}<span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         d
        
        
         (
        
        
         p
        
        
         ,
        
        
         q
        
        
         )
        
        
         =
        
        
         
          
           
            ∑
           
           
            
             i
            
            
             =
            
            
             1
            
           
           
            D
           
          
          
           
            (
           
           
            
             q
            
            
             i
            
           
           
            −
           
           
            
             p
            
            
             i
            
           
           
            
             )
            
            
             2
            
           
          
         
         
        
         ,
        
       
       
         d(\boldsymbol p, \boldsymbol q) = \sqrt{\sum_{i=1}^D{(q_i-p_i)^2}} \, , 
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal">d</span><span class="mopen">(</span><span class="mord"><span class="mord"><span class="mord boldsymbol">p</span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord"><span class="mord"><span class="mord boldsymbol" style="margin-right: 0.037em;">q</span></span></span><span class="mclose">)</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 3.3338em; vertical-align: -1.2777em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 2.0561em;"><span class="svg-align" style="top: -5.2938em;"><span class="pstrut" style="height: 5.2938em;"></span><span class="mord" style="padding-left: 1.056em;"><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.8283em;"><span class="" style="top: -1.8723em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span class="" style="top: -3.05em;"><span class="pstrut" style="height: 3.05em;"></span><span class=""><span class="mop op-symbol large-op">∑</span></span></span><span class="" style="top: -4.3em; margin-left: 0em;"><span class="pstrut" style="height: 3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right: 0.0278em;">D</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.2777em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord"><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0359em;">q</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-left: -0.0359em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mord"><span class="mord mathnormal">p</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.7401em;"><span class="" style="top: -2.989em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span><span class="" style="top: -4.0161em;"><span class="pstrut" style="height: 5.2938em;"></span><span class="hide-tail" style="min-width: 0.742em; height: 3.3738em;">
</span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 1.2777em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mpunct">,</span></span></span></span></span>{% endraw %}  
 where {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        p
       
      
      
       \boldsymbol p
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6389em; vertical-align: -0.1944em;"></span><span class="mord"><span class="mord"><span class="mord boldsymbol">p</span></span></span></span></span></span></span>{% endraw %} and {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        q
       
      
      
       \boldsymbol q
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6389em; vertical-align: -0.1944em;"></span><span class="mord"><span class="mord"><span class="mord boldsymbol" style="margin-right: 0.037em;">q</span></span></span></span></span></span></span>{% endraw %} are the two points in our {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        D
       
      
      
       D
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.0278em;">D</span></span></span></span></span>{% endraw %}-dimensional Euclidean space.



```python
## EDIT THIS FUNCTION
def euclidean_distance(p, q):
    return np.sqrt(np.sum((p-q)**2, axis=1)) ## <-- SOLUTION
```



<a id="section-2"></a>

### <a id="t3"></a><a id="Section_2_Classification_with_kNN_outline_53"></a>Section 2: Classification with kNN [^](#outline)

We start with using kNN for classification tasks, and create a dataset with sklearn’s [`make_classification`](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_classification.html) function and standardise the data.



```python
X_class, y = make_classification(n_samples=100, n_features=2, n_redundant=0, n_informative=2, n_clusters_per_class=1, n_classes=3, random_state=15)
```




```python
## EDIT THIS FUNCTION
def standardise(X):
  mu = np.mean(X, 0)
  sigma = np.std(X, 0)
  X_std = (X - mu) / sigma ## <-- SOLUTION
  return X_std
```




```python
X = standardise(X_class)
```



As with any other supervised machine learning method, we create a training and test set to learn and evaluate our model, respectively.



```python
# shuffling the rows in X and y
p = np.random.permutation(len(y))
X = X[p]
y = y[p]

# we split train to test as 70:30
split_rate = 0.7
X_train, X_test = np.split(X, [int(split_rate*(X.shape[0]))])
y_train, y_test = np.split(y, [int(split_rate*(y.shape[0]))])
```



We visualise the data set with points in the training set being fully coloured and points in the test being half-transparent.



```python
# define colormaps
cm = plt.cm.RdBu
cm_bright = ListedColormap(['blue', 'red', 'green'])

# visual exploration
plt.figure(figsize=(12,8))
plt.xlabel(r'$X^{(1)}$', size=24)
plt.ylabel(r'$X^{(2)}$', size=24)
plt.scatter(X_train[:, 0], X_train[:, 1], c=y_train, cmap=cm_bright)
plt.scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap=cm_bright, alpha=0.25)
plt.show()
```



​  
 ![请添加图片描述](/images/migrated/e498f6d92317048ce9a2.png)

​

We try to find the *k* nearest neighbours in our training set for every test data point. The majority of labels of the *k* closest training points determines the label of the test point.



```python
## EDIT THIS FUNCTION
def k_neighbours(X_train, X_test, k=5, return_distance=False):
  n_neighbours = k
  dist = []
  neigh_ind = []

  # compute distance from each point x_test in X_test to all points in X_train (hint: use python's list comprehension)
  point_dist = [euclidean_distance(x_test, X_train) for x_test in X_test] ## <-- SOLUTION

  # determine which k training points are closest to each test point
  for row in point_dist:
      enum_neigh = enumerate(row)
      sorted_neigh = sorted(enum_neigh, key=lambda x: x[1])[:k]

      ind_list = [tup[0] for tup in sorted_neigh]
      dist_list = [tup[1] for tup in sorted_neigh]

      dist.append(dist_list)
      neigh_ind.append(ind_list)

  # return distances together with indices of k nearest neighbours
  if return_distance:
      return np.array(dist), np.array(neigh_ind)

  return np.array(neigh_ind)
```



Once we know which *k* neighbours are closest to our test points, we can predict the labels of these test points.

We implement this in a “pythonic” way and call the previous function `k_neighbours` *within* the next function `predict`.

Our `predict` function determines how any point {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         x
        
        
         test
        
       
      
      
       x_\text{test}
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.5806em; vertical-align: -0.15em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.2806em;"><span class="" style="top: -2.55em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord text mtight"><span class="mord mtight">test</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span></span></span></span></span>{% endraw %} in the test set is classified. Here, we only consider the case where each of the *k* neighbours contributes equally to the classification of {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         x
        
        
         test
        
       
      
      
       x_\text{test}
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.5806em; vertical-align: -0.15em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.2806em;"><span class="" style="top: -2.55em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord text mtight"><span class="mord mtight">test</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span></span></span></span></span>{% endraw %}.



```python
## EDIT THIS FUNCTION
def predict(X_train, y_train, X_test, k=5):
  # each of the k neighbours contributes equally to the classification of any data point in X_test
  neighbours = k_neighbours(X_train, X_test, k=k)
  # count number of occurences of label with np.bincount and choose the label that has most with np.argmax (hint: use python's list comprehension)
  y_pred = np.array([np.argmax(np.bincount(y_train[neighbour])) for neighbour in neighbours]) ## <-- SOLUTION

  return y_pred
```



To evaluate the algorithm in a more principled way, we need to implement a function that computes the mean accuracy by counting how many of the test points have been classified correctly and dividing this number by the total number of data points in our test set.

Again, we do this is in a pythonic way and call the previous `predict` function *within* the next function `score`.



```python
## EDIT THIS FUNCTION
def score(X_train, y_train, X_test, y_test, k=5):
  y_pred = predict(X_train, y_train, X_test, k=k) ## <-- SOLUTION
  return np.float(sum(y_pred==y_test))/ float(len(y_test))
```



It is quite common to print both the training and test set accuracies.



```python
k = 8
print('Training set mean accuracy:', score(X_train, y_train, X_train, y_train, k=k))
print('Test set mean accuracy:', score(X_train, y_train, X_test, y_test, k=k))
```




```
Training set mean accuracy: 0.8714285714285714
Test set mean accuracy: 0.9666666666666667


<ipython-input-10-1ef50d68801b>:4: DeprecationWarning: `np.float` is a deprecated alias for the builtin `float`. To silence this warning, use `float` by itself. Doing this will not modify any behavior and is safe. If you specifically wanted the numpy scalar type, use `np.float64` here.
Deprecated in NumPy 1.20; for more details and guidance: https://numpy.org/devdocs/release/1.20.0-notes.html#deprecations
  return np.float(sum(y_pred==y_test))/ float(len(y_test))
```



##### <a id="Questions_195"></a>Questions

1. Does the solution above look reasonable?
2. Play around with different values for *k*. How does it influence the classification mean accuracy?
3. Compare the training and test set accuracy. Is there a difference? If so, what does the difference tell you?
4. Choose different ratios for the split between training and test set, and re-run the entire algorithm. What can you learn from different ratios?
5. Considering an accuracy estimate on a test-split wich contains 30% of the dataset examples is 0.86, do we guarantee to obtain the same accuracy estimate when we apply our model on infinetely large unseen test examples, i.e. does the accuracy of your model on the test-split generalize well on unseen data? From this week’s lecture notes, what would you suggest to improve our confidence in the accuracy estimate, so it is more closer estimate to the true accuracy when testing on unseen examples?

<a id="section-3"></a>

#### <a id="t4"></a><a id="3_Hyperparameter_Tuning_for_k_with__Tfold__Cross_outline_205"></a>3 Hyperparameter Tuning for {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} with *T-fold* Cross [^](#outline)

Let’s consider a systematic way to help select the best {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} (i.e. the hyperparameter of {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-NN). In previous cells, we splitted our data into 70%:30% for training:test examples. Now we need to choose the best {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}, but without looking at the accuracy on the test set (which should be used at the end to assess the predictive power of the model with the chosen {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}). To this end, we perform {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        T
       
      
      
       T
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">T</span></span></span></span></span>{% endraw %}-fold cross validation, where, **importantly**, we don’t evaluate the accuracy of the model using the same examples on which we trained our model, rather on a held out validation set. We can achieve this by running {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        T
       
      
      
       T
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">T</span></span></span></span></span>{% endraw %} experiments, and in each one we use disjoint partitions for the training and accuracy examples. By averaging the accuracy estimates over the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        T
       
      
      
       T
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">T</span></span></span></span></span>{% endraw %} experiments, we get a more precise and reliable accuracy estimate than before. If we consider {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        T
       
       
        =
       
       
        3
       
      
      
       T=3
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">T</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 0.6444em;"></span><span class="mord">3</span></span></span></span></span>{% endraw %} folds, then we can run the three experiments and evaluate the average accuracy as in the figure below:

![cv](/images/migrated/517427a8109540a6e07f.png)

Finaly, we need to isolate a separate set, before using cross-validation for hyperparameter tuning, to test our model after selecting the best performing {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} for {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %}-NN, so we further consider the following partitioning, which we will need to adhere with throughout the future notebooks and courseworks (i.e. in the problems when we need to use cross-validation for hyperparameter tuning then test on completely unseen data that are not involved in hyperparamter tuning):

![cv2](/images/migrated/802966a6ed686fb85b0d.png)

Let’s consider a ratio 80:20 for training and test splits



```python
# shuffling the rows in X and y
p = np.random.permutation(len(y))
X = X[p]
y = y[p]


# we split train to test as 80:20
split_rate = 0.8
X_train, X_test = np.split(X, [int(split_rate*(X.shape[0]))])
y_train, y_test = np.split(y, [int(split_rate*(y.shape[0]))])
```



Now let’s partition our training split into 5-folds. We could store the corresponding indices only:



```python
# Now we have a list of five index arrays, each correspond to one of the five folds.
folds_indexes = np.split(np.arange(len(y_train)), 5)
folds_indexes
```




```
[array([ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15]),
 array([16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]),
 array([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]),
 array([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]),
 array([64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79])]
```



Let’s implement a function that evalutes the accuracy of model with a given {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} by running {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        T
       
      
      
       T
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6833em;"></span><span class="mord mathnormal" style="margin-right: 0.1389em;">T</span></span></span></span></span>{% endraw %} experiments and returning the average evaluated accuracy.



```python
# EDIT THIS FUNCTION
def cross_validation_score(X_train, y_train, folds, k):
  scores = []
  for i in range(len(folds)):
    val_indexes = folds[i]
    train_indexes = list(set(range(y_train.shape[0])) - set(val_indexes))

    X_train_i = X_train[train_indexes, :]
    y_train_i = y_train[train_indexes]


    X_val_i = X_train[val_indexes, :] # <- SOLUTION
    y_val_i = y_train[val_indexes] # <- SOLUTION

    score_i = score(X_train_i, y_train_i, X_val_i, y_val_i, k=k) # <- SOLUTION
    scores.append(score_i)

  # Return the average score
  return sum(scores) / len(scores) # <- SOLUTION
```



Let’s scan a range of {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        k
       
      
      
       k
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.6944em;"></span><span class="mord mathnormal" style="margin-right: 0.0315em;">k</span></span></span></span></span>{% endraw %} in {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        [
       
       
        1
       
       
        ,
       
       
        30
       
       
        ]
       
      
      
       [1, 30]
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mopen">[</span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord">30</span><span class="mclose">]</span></span></span></span></span>{% endraw %} and select the one with the best cross-validation accuracy.



```python
def choose_best_k(X_train, y_train, folds, k_range):
  k_scores = np.zeros((len(k_range),))

  for i, k in enumerate(k_range):
    k_scores[i] = cross_validation_score(X_train, y_train, folds, k)
    print(f'CV_ACC@k={k}: {k_scores[i]:.3f}')

  best_k_index = np.argmax(k_scores)
  return k_range[best_k_index]
```




```python
best_k = choose_best_k(X_train, y_train, folds_indexes, np.arange(1, 31))

print('best_k:', best_k)
```




```
<ipython-input-10-1ef50d68801b>:4: DeprecationWarning: `np.float` is a deprecated alias for the builtin `float`. To silence this warning, use `float` by itself. Doing this will not modify any behavior and is safe. If you specifically wanted the numpy scalar type, use `np.float64` here.
Deprecated in NumPy 1.20; for more details and guidance: https://numpy.org/devdocs/release/1.20.0-notes.html#deprecations
  return np.float(sum(y_pred==y_test))/ float(len(y_test))


CV_ACC@k=1: 0.762
CV_ACC@k=2: 0.787
CV_ACC@k=3: 0.825
CV_ACC@k=4: 0.825
CV_ACC@k=5: 0.812
CV_ACC@k=6: 0.825
CV_ACC@k=7: 0.825
CV_ACC@k=8: 0.875
CV_ACC@k=9: 0.838
CV_ACC@k=10: 0.875
CV_ACC@k=11: 0.863
CV_ACC@k=12: 0.863
CV_ACC@k=13: 0.850
CV_ACC@k=14: 0.863
CV_ACC@k=15: 0.838
CV_ACC@k=16: 0.838
CV_ACC@k=17: 0.838
CV_ACC@k=18: 0.787
CV_ACC@k=19: 0.800
CV_ACC@k=20: 0.812
CV_ACC@k=21: 0.812
CV_ACC@k=22: 0.787
CV_ACC@k=23: 0.812
CV_ACC@k=24: 0.800
CV_ACC@k=25: 0.775
CV_ACC@k=26: 0.762
CV_ACC@k=27: 0.787
CV_ACC@k=28: 0.750
CV_ACC@k=29: 0.750
CV_ACC@k=30: 0.762
best_k: 8
```



Finally, let’s evaluate the accuracy with the best k on on the unseen part, the test-split that we isolated earlier.



```python
score(X_train, y_train, X_test, y_test, k=best_k)
```




```
<ipython-input-10-1ef50d68801b>:4: DeprecationWarning: `np.float` is a deprecated alias for the builtin `float`. To silence this warning, use `float` by itself. Doing this will not modify any behavior and is safe. If you specifically wanted the numpy scalar type, use `np.float64` here.
Deprecated in NumPy 1.20; for more details and guidance: https://numpy.org/devdocs/release/1.20.0-notes.html#deprecations
  return np.float(sum(y_pred==y_test))/ float(len(y_test))





1.0
```



<a id="section-4"></a>

### <a id="t5"></a><a id="Section_4__Regression_with_kNN_outline_362"></a>Section 4: Regression with kNN [^](#outline)

The kNN algorithm is mostly used for classification, but we can also utilise it for (non-linear) regression. Here, we calculate the label of every point in the test set as the mean of the *k* nearest neighbours.

We start with defining a training set with sklearn’s California housing data set. Note that this data set has normally 8 features, but we only extract the first feature, which corresponds to the median income in the district. The label is the median house value in the district.



```python
data = fetch_california_housing(return_X_y=True)
X = data[0][:,0].reshape((-1, 1))
y = data[1]

X_std = standardise(X)
```



As before, we first divide the data into training and test set:



```python
# shuffling the rows in X and y
p = np.random.permutation(len(y))
X = X_std[p]
y = y[p]

# we split train to test as 70:30
split_rate = 0.7
X_train, X_test = np.split(X, [int(split_rate*(X.shape[0]))])
y_train, y_test = np.split(y, [int(split_rate*(y.shape[0]))])
```



Let’s plot it to get a sense how we can proceed. This time, we plot training examples in blue and test examples in red.



```python
# visual exploration
plt.figure(figsize=(12,8))
plt.xlabel(r"median income in '000 USD", size=20)
plt.ylabel(r"median house value in '00.000 USD", size=20)
plt.scatter(X_train, y_train, c='blue', alpha=0.25)
plt.scatter(X_test, y_test, c='red', alpha=0.25)
plt.show()
```



​  
 ![请添加图片描述](/images/migrated/370af74927ebb58f2768.png)

​

As before, we need to define a predicting function which we call `reg_predict`.



```python
## EDIT THIS FUNCTION
def reg_predict(X_train, y_train, X_test, k=20):
  # each of the k neighbours contributes equally to the classification of any data point in X_test
  neighbours = k_neighbours(X_train, X_test, k=k)
  # compute mean over neighbours labels (hint: use python's list comprehension)
  y_pred = np.array([np.mean(y_train[neighbour]) for neighbour in neighbours]) ## <-- SOLUTION

  return y_pred
```




```python
# computing predictions... (takes a few minutes due to the high sample size)
k = 20
y_pred = reg_predict(X_train, y_train, X_test, k=k)
```




```python
# ... and plotting them
plt.figure(figsize=(12,8))
plt.xlabel(r"median income (standardised)", size=20)
plt.ylabel(r"median house value in '00.000 USD", size=20)
#plt.scatter(X_train, y_train, c='blue', alpha=0.25)
plt.scatter(X_test, y_test, c='red', alpha=0.25)
plt.scatter(X_test, y_pred, c='yellow', alpha=0.25)
plt.show()
```



​  
 ![请添加图片描述](/images/migrated/bb2773b7e75f7a3480dd.png)

​

To determine how well the prediction was, let us determine the {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         R
        
        
         2
        
       
      
      
       R^2
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.8141em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0077em;">R</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8141em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>{% endraw %} score. The labels of the test set will be called {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        y
       
      
      
       y
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.625em; vertical-align: -0.1944em;"></span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span></span></span></span></span>{% endraw %} and the predictions on the test data {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         y
        
        
         ^
        
       
      
      
       \hat{y}
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.8889em; vertical-align: -0.1944em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.6944em;"><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span></span><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="accent-body" style="left: -0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1944em;"><span class=""></span></span></span></span></span></span></span></span></span>{% endraw %}.  
 {% raw %}<span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         
          R
         
         
          2
         
        
        
         (
        
        
         y
        
        
         ,
        
        
         
          y
         
         
          ^
         
        
        
         )
        
        
         =
        
        
         1
        
        
         −
        
        
         
          
           
            ∑
           
           
            
             i
            
            
             =
            
            
             1
            
           
           
            n
           
          
          
           (
          
          
           
            y
           
           
            i
           
          
          
           −
          
          
           
            
             y
            
            
             ^
            
           
           
            i
           
          
          
           
            )
           
           
            2
           
          
         
         
          
           
            ∑
           
           
            
             i
            
            
             =
            
            
             1
            
           
           
            n
           
          
          
           (
          
          
           
            y
           
           
            i
           
          
          
           −
          
          
           
            y
           
           
            ˉ
           
          
          
           
            )
           
           
            2
           
          
         
         
        
         ,
        
       
       
         R^2(y, \hat{y}) = 1 - \frac{\sum_{i=1}^n (y_i - \hat{y}_i)^2}{\sum_{i=1}^n (y_i - \bar{y})^2} \, , 
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 1.1141em; vertical-align: -0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0077em;">R</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8641em;"><span class="" style="top: -3.113em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span><span class="mpunct">,</span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.6944em;"><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span></span><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="accent-body" style="left: -0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1944em;"><span class=""></span></span></span></span></span><span class="mclose">)</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 0.7278em; vertical-align: -0.0833em;"></span><span class="mord">1</span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.2222em;"></span></span><span class="base"><span class="strut" style="height: 2.4978em; vertical-align: -0.994em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.5038em;"><span class="" style="top: -2.3057em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mop"><span class="mop op-symbol small-op" style="position: relative; top: 0em;">∑</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8043em;"><span class="" style="top: -2.4003em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span class="" style="top: -3.2029em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.2997em;"><span class=""></span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-left: -0.0359em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.5678em;"><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span></span><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="accent-body" style="left: -0.1944em;"><span class="mord">ˉ</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1944em;"><span class=""></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.7401em;"><span class="" style="top: -2.989em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.6897em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mop"><span class="mop op-symbol small-op" style="position: relative; top: 0em;">∑</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8043em;"><span class="" style="top: -2.4003em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span class="" style="top: -3.2029em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.2997em;"><span class=""></span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-left: -0.0359em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.2222em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.6944em;"><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span></span><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="accent-body" style="left: -0.1944em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1944em;"><span class=""></span></span></span></span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-left: -0.0359em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8141em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.994em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mpunct">,</span></span></span></span></span>{% endraw %}  
 where {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
    
     
      
       
        
         y
        
        
         ˉ
        
       
       
        =
       
       
        
         1
        
        
         n
        
       
       
        
         ∑
        
        
         
          i
         
         
          =
         
         
          1
         
        
        
         n
        
       
       
        
         y
        
        
         i
        
       
      
      
       \bar{y} = \frac{1}{n} \sum_{i=1}^n y_i
      
     
    </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.7622em; vertical-align: -0.1944em;"></span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.5678em;"><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span></span><span class="" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="accent-body" style="left: -0.1944em;"><span class="mord">ˉ</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1944em;"><span class=""></span></span></span></span></span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 1.1901em; vertical-align: -0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8451em;"><span class="" style="top: -2.655em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.394em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.345em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mop"><span class="mop op-symbol small-op" style="position: relative; top: 0em;">∑</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8043em;"><span class="" style="top: -2.4003em; margin-left: 0em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span class="" style="top: -3.2029em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.2997em;"><span class=""></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0359em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.3117em;"><span class="" style="top: -2.55em; margin-left: -0.0359em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.15em;"><span class=""></span></span></span></span></span></span></span></span></span></span>{% endraw %}.



```python
## EDIT THIS FUNCTION
def r2_score(y_test, y_pred):
  numerator = np.sum((y_test - y_pred)**2) ## <-- SOLUTION
  y_avg = np.mean(y_test) ## <-- SOLUTION
  denominator = np.sum((y_test - y_avg)**2) ## <-- SOLUTION
  return 1 - numerator/denominator
```




```python
print(r'R2 score:', r2_score(y_test, y_pred))
```




```
R2 score: 0.44745758748846054
```



##### <a id="Questions_477"></a>Questions

1. Does the solution above look reasonable? What does your {% raw %}<span class="katex--inline"><span class="katex"><span class="katex-mathml">
     
      
       
        
         
          R
         
         
          2
         
        
       
       
        R^2
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.8141em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right: 0.0077em;">R</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8141em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>{% endraw %} value tell you?
2. Play around with different values for *k*. How does it influence the regression?
3. Like we did in classification, excercise with implementing cross-validation to find the best performing k on the regression task.
4. Compare the training and test set accuracy. Is there a difference? If so, what does the difference tell you?
5. Choose different ratios for the split between training and test set, and re-run the entire algorithm. What can you learn from different ratios?
6. Can you replicate your results using [sklearn](https://scikit-learn.org/stable/modules/neighbors.html)?
7. Based on sklearn’s documentation, can you see any differences in the algorithms that are implemented in sklearn?
