#!/bin/bash
echo "Asumi 正在为你同步博客内容..."
git pull
echo "同步完成！正在构建博客..."
bundle exec jekyll build
echo "构建完成！正在部署博客..."