---
title: "基于OpenCV的卷积图像处理"
excerpt: "记录了OpenCV学习过程"
date: 2025-12-14
categories:
  - 编程
tags:
  - 博客
  - 记录
  - 编程

entries_layout: grid

# header:
#   teaser: /assets/images/2025-12-17-20-39-48.png
---

# 前言

决定现在开始先学习一些**卷积**操作，为后期的**卷积神经网络**的学习打牢基本功。

还要抽时间搞王俊刚老师的课题 **《随机矩阵理论视角下的神经网络训练动力学实验研究》** 感觉很高大上，但又不难理解，很有意思。

# 图像通道分离



`cv2.split`函数是将图像按通道数拆分的操作

对于 OpenCV 读入的彩色图像：

`img.shape == (H, W, 3)`

执行

`b, g, r = cv2.split(img)`

得到：
```
b.shape == (H, W)
g.shape == (H, W)
r.shape == (H, W)
```

也就是说：

* 原来是 **一个三维数组**

* 现在变成 **三个二维灰度图**

---

**从numpy本质上讲，该函数操作相当于**

```Numpy slicing
b = img[:, :, 0]
g = img[:, :, 1]
r = img[:, :, 2]
```

所以，学习时可使用`cv2.split()`，但是高性能处理更推荐使用`Numpy Slicing`。

频繁 split 会影响性能，尤其是视频处理。

---

## 示例代码

```python
def get_image_RGB(self):
    """
    获取图片BGR颜色通道并显示
    :return: None
    """
    img = cv2.imread(self.imagePath)
    (b, g, r) = cv2.split(img)
    img_b = np.dstack((b, np.zeros(g.shape), np.zeros(r.shape)))
    img_g = np.dstack((np.zeros(b.shape), g, np.zeros(r.shape)))
    img_r = np.dstack((np.zeros(b.shape), np.zeros(g.shape), r))
```

# 平滑滤波（平均滤波）

## 构造卷积核kernel

`kernel = np.ones((3,3), np.float32) / 9`



---

## 示例代码

```Python
def smooth_filter(self):
    img = cv2.imread(self.imagePath)
    kernel = np.ones((3,3), np.float32) / 9
    det = cv2.filter2D(img, -1, kernel)
```

