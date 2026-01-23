---
title: 什么是hook？
excerpt: Csharp学习记录

categories: 
  -  编程

tags:
  -  博客
  -  编程
  -  记录
comments: true
entries_layout: grid

# header:
#     teaser: 

---

# 定义

在基于事件驱动的 Windows 操作系统的图形子系统中，钩子（`Hook`） 是一种截获（`Intercept`）系统与应用程序之间**消息传递流**的机制

例如，`WPF` 框架中的 `HwndSource.AddHook` 接口，它允许开发者注册一个回调函数，建立一个位于操作系统底层原始消息（`Raw Messages`）与高级 UI 框架事件系统（`High-level Events`）之间的代理层

也就是说，钩子机制是连接底层 `Win32 API` 与上层 `.NET` 运行时的关键通信桥梁

# 诠释

在Windows操作系统中，对外界的响应是由`消息（Message）`构造的

移动鼠标、按下键盘、点击窗口等会生成一条消息发送到对应窗口

通常情况下，WPF应用框架会自发处理信息，如将“左键按下”处理为`Button_Click`

对于希望在消息到达框架前就拦截信息，或者未为框架提供接口时，就可以使用钩子来提前获取消息

即：在系统的消息传递路径上，“钩”住感兴趣的信息

# 举例

对于我正在推进的C#解决方案：

```csharp
private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
{
    const int WM_HOTKEY = 0x0312; // 热键消息
    if (msg == WM_HOTKEY && wParam.ToInt32() == HOTKEY_ID)
    {
        Dispatcher.Invoke(() =>
        {
            ... ...
        });
        handled = true;
    }
    return IntPtr.Zero;
}
```

将其注入：

```csharp
protected override void OnSourceInitialized(EventArgs e)
{
    base.OnSourceInitialized(e);

    HwndSource source = HwndSource.FromHwnd(handle);
    source.AddHook(WndProc);
}
```