# Java 内部类学习笔记

- URL: https://blog.no-claw.com/f13e8b32/
- 日期: 2019-06-22
- 分类: 软件 / 编程
- 标签: 开发, Java

java的内部类和python和js的闭包有些类似，实际上就是在一个类的内部定义另外一个类，既然类了可以有字段，方法，那么为什么不可以定义一个类了，用c写过链表的读者可以发现在结构体里面还定义了结构体变量。下边举个例子：

###### 1.默认访问控制的内部类（public）

```
class Outclass {
    int x = 5;

    class Innerclass  {
        int x = 10;
    }
}

public class Test {
    public static void main(String[] args) {
        Outclass o = new Outclass();
        Outclass.Innerclass i = o.new Innerclass();
        System.out.println(o.x);
        System.out.println(i.x);
    }
}
```

需要注意的是，这里办法需要先对外边的类进行实例化，才可以用内部类创建对象。
 那么是不是有什么呢简单的方法呢？
 当然有！！！
 我们需要加入一些访问控制，比如我们要用类名来调用字段和方法的时候通常在前面加static修饰，这里也不例外，下边我们看一下：

###### 2.静态内部类

```
class Outclass {
    int x = 5;

   static class Innerclass  {
        int x = 10;
    }
}

public class Test {
    public static void main(String[] args) {
        Outclass.Innerclass i = new Outclass.Innerclass();
        System.out.println(i.x);
    }
}
```

这里就可以在不创建外部类的基础上直接实例化内部类了。

###### 3.访问控制（private， protected）

当然内部类也同样支持private， protected这两种修饰

```
class Outclass {
    int x = 5;

   private class Innerclass  {
        int x = 10;
    }
}

public class Test {
    public static void main(String[] args) {
        Outclass o = new Outclass();
        Outclass.Innerclass i = o.new Innerclass();
        System.out.println(o.x);
        System.out.println(i.x);
    }
}
```

和之前类似的这段代码是跑不通的，因为尝试在主函数里访问内部类了。
 IDEA报错如下：
 [图：Java 内部类学习笔记配图]

###### 4.在内部类里访问外部类字段和方法

这个是内部类的一个优点，一个在内部类里访问外部类的字段和方法。但是直接用实例化的内部类对象调用会报错。

```
class Outclass {
    int x = 5;

    void printOut() {
        System.out.println("外部类");
    }
     class Innerclass  {
        int innerMethod() {
            return  x;
        }

        void printInner() {
            printOut();
            System.out.println("访问内部类");
        }
    }
}

public class Test {
    public static void main(String[] args) {
        Outclass o = new Outclass();
        Outclass.Innerclass i = o.new Innerclass();
        System.out.println(i.innerMethod());
        i.printInner();
    }
}
```

结果如下
 [图：Java 内部类学习笔记配图]

[参考w3schools.com](https://www.w3schools.com/java/java_inner_classes.asp)
