# Python 调用 Java 与 C++ 的尝试

- URL: https://blog.no-claw.com/fea420b7/
- 日期: 2019-02-21
- 分类: 软件 / 编程
- 标签: 开发, Python, C++, Java

[Python 编程与环境笔记：系列目录](/series/python/)

#### python是有名的胶水语言,今天打算试下它的胶水特性。

（环境Ubuntu16.04,win10因为gcc的原因不知道为什么一直报错）

---

1.首先先说Java的部分，在Python中启动JVM就要调用jpype，直接pip安装就好了。

```
pip install jpype1
```

然后import jpype，就可以在Python里面写Java代码。

---

2.c++部分

c++部分还是要依靠g++，利用gcc原本的功能把cpp文件编译成为so文件，然后在Python中直接调用。

```
//c++代码
#include <iostream>
using namespace std;

class TestLib
{
    public:
        int display();
        void display(int a);
		void add(int a);
};
int TestLib::display() {
    cout<<"First display"<<endl;
	return 1;
}

void TestLib::display(int a) {
    cout<<"Second display:"<<a<<endl;
}

void TestLib::add(int a) {
		cout<<a<<endl;
	}

extern "C" {
    TestLib obj;
    int display() {
        obj.display();
      }
    void display_int() {
        obj.display(2);
      }

	void add_re() {
		obj.add(1);
	}

}
```

编译命令：

```
g++ -o s.so -shared -fPIC s.cpp
```

```
from jpype import *
startJVM(getDefaultJVMPath(), "-ea")
a = java.lang.System.out.println("Hello World")
shutdownJVM()

import ctypes
so = ctypes.cdll.LoadLibrary
lib = so("./s.so")
print('display()')
b = lib.display()
print('display(100)')
lib.display_int(100)
lib.add_re()
c = lib.add_re()
print(b)
```
