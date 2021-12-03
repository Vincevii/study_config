# 组成

1. LAMP = Linux + Apache + Mysql + PHP
2. LNMP = Linux + Nginx + Mysql + PHP

# 正向代理和反向代理

1. 正向代理是：隐藏真正的客户端，客户端请求的服务都被代理服务器代替来请求，服务端不知道真实的客户端是谁，常被用作，翻墙
2. 反向代理是：隐藏了真实的服务端，通过反向代理服务器，把我们的请求转发到真实的服务器里面去，Nginx是很好的反向代理服务器，用来做负载均衡。反向代理用作，cdn，负载均衡

# Nginx 和 Apache

## Nginx

1. Nginx 是高性能的http和反向代理web 服务器，同事提供IMAP/POP3/SMTP服务

## Apache

1. 是世界使用排名第一的Web服务器软件

## 区别

1. Nginx配置简洁，Apache复杂
2. Nginx对比Apache更加节省资源
3. Nginx  适合静态  Apache 适合动态交互

## 总结

1. 一般来说，需要性能的 web 服务，用 nginx
2. 如果不需要性能只求稳定，更考虑 apache
