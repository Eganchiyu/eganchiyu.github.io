---
title: 什么是namespace？
excerpt: Csharp学习记录

categories: 
  -  编程

tags:
  -  博
  -  编程
  -  记录
comments: true
entries_layout: grid

# header:
#     teaser: 

---

# 命名空间namespace

命名空间（namespace）是 C# 和 C++ 中都有的一个核心概念，用于**组织代码**并**防止命名冲突**

所谓冲突是这样的：

```python
# Python示例 - 假设没有模块系统
def connect():  # 你的数据库连接函数
    print("连接到我的数据库")

def connect():  # 同事写的网络连接函数
    print("连接到服务器")  # 冲突！同名函数
```

```cpp
// C++示例 - 没有命名空间
class Database {  // 你的数据库类
    void connect();
};

class Database {  // 别人的数据库类
    void connect();  // 冲突！同名类
};
```

如果两个部门的代码中，包含同名函数或变量，引用到一个工程的时候就会出现命名冲突

这个时候，需要使用不同的命名空间来区分：

```csharp
// C# 解决方案
namespace MyProject.Database {
    public class Database {
        public void Connect() {
            Console.WriteLine("连接到我的数据库");
        }
    }
}

namespace NetworkLibrary {
    public class Database {  // 同名但不同命名空间，OK！
        public void Connect() {
            Console.WriteLine("连接到服务器");
        }
    }
}
```

代码中的使用：

```csharp
// 完整地址（完全限定名）
System.Console.WriteLine("Hello");
System.Collections.Generic.List<string> list;
```

或者可以简化，使用`using`来定义默认命名空间

```csharp
// 简化使用（使用 using）
using System;
Console.WriteLine("Hello");  // 因为知道在 System 命名空间里

using System.Collections.Generic;
List<string> list;  // 因为知道在 System.Collections.Generic 里
```

类比python，就相当于模块和`import`用法

```python
# Python 用模块和包来组织
import os
import sys
from datetime import datetime

os.path.join()  #- os 是模块，path 是子模块
datetime.now()  #- 从 datetime 模块导入的类
```

# 使用示例

```csharp
// 文件：database.cs
namespace MyCompany.MyProject.Database {
    public class Connection {
        public void Open() { }
    }
}

// 另一个文件：program.cs
using MyCompany.MyProject.Database;

class Program {
    static void Main() {
        var conn = new Connection();  // 知道是哪个 Connection
        conn.Open();
    }
}
```

```cpp
// 头文件：database.h
namespace MyCompany {
    namespace MyProject {
        class Connection {
        public:
            void open();
        };
    }
}

// 源文件：main.cpp
using namespace MyCompany::MyProject;

int main() {
    Connection conn;  // 使用特定命名空间的 Connection
    conn.open();
}
```

---

使用场景

```
电商项目/
├── 用户模块/
│   ├── User.cs          (namespace ECommerce.User)
│   └── Address.cs       (namespace ECommerce.User)
├── 商品模块/
│   ├── Product.cs       (namespace ECommerce.Product)
│   └── Category.cs      (namespace ECommerce.Product)
└── 订单模块/
    ├── Order.cs         (namespace ECommerce.Order)
    └── Payment.cs       (namespace ECommerce.Order)
```

# 命名空间的三个核心特性

## 特性1：作用域容器

```csharp
namespace Outer {
    class ClassA { }  // 完全名称：Outer.ClassA
    
    namespace Inner {
        class ClassA { }  // 完全名称：Outer.Inner.ClassA
        // 可以有同名类，因为路径不同！
    }
}
```

## 特性2：逻辑分组

```csharp
// 所有数据库相关的放一起
namespace MyApp.DataAccess {
    class Database { }
    class Repository { }
    class Connection { }
}

// 所有界面相关的放一起
namespace MyApp.UI {
    class Window { }
    class Button { }
    class Menu { }
}
```

## 特性3：访问控制

```csharp
namespace LibraryA {
namespace LibraryA {
    public class PublicClass { }     // 可以被外部访问
    internal class InternalClass { } // 只能在同一命名空间内访问
}

namespace LibraryB {
    // 可以访问 LibraryA.PublicClass
    // 但不能访问 LibraryA.InternalClass
}
```

# 总结

命名空间就是将代码元素赋予“地址”，使得元素可以共存，并让代码组织更清晰

简单来说就是：

```
张老师()
张老师()
```

和

```
数学教研组.张老师()
语文教研组.张老师()
```

的区别