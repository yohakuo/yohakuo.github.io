---
date:
share: true
tags:
  - SQL
categories: 六分经验
archive:
---

跟着 datacamp 学完了 SQL 中级课程（使用 PostgreSQL）。下面是出现过的子句写法。

## 在开始前
SQL 并不是按书写顺序来执行的。可以先对**执行顺序**有所了解。
```SQL
FROM->WHERE->GROUP BY->HAVING->SELECT->ORDER BY->LIMIT
```

## 选择和过滤
`SELECT` 
```sql
SELECT * 
SELECT currentDatabase();查看当前所在的数据库。
-- DISTINCT 用于返回唯一不同的值。
SELECT DISTINCT col1,col2
```
`WHERE`  过滤数据（作用于单行）
```sql
--使用AND、OR可以连接多个筛选要求。AND后的句子过长可以用括号
WHERE col > 1 AND col = ''
-- BETWEEN ... AND 用于快速选择时间段
WHERE col BETWEEN a AND b
-- 可以是字符或数字
WHERE col in ('','')
```
`LIKE\NOT LIKE` 用于过滤字符串。`%` 匹配多个字符，`_` 匹配一个字符
```sql
WHERE col like 'A%'
```
`IS NULL\IS NOT NULL` 用于过滤空值
```SQL
WHERE col IS NULL
```

## 总结特点
> 主要是聚合函数

`COUNT()` 的作用是“计数”
```sql
-- 包含NULL
SELECT COUNT(*) 
-- 不包含NULL
SELECT COUNT(col) 
SELECT COUNT(DISTINCT col) 
```
`MIN()和MAX()` 
```sql
select MIN(time) AS min_time,MAX(time) AS max_time 
FROM table_name
```
`ROUND()` 四舍五入, 参数可以为负数，表示整数取整
```
-- 表示取整到个位
ROUND(AVG(col),-1)
```

## 分组、排序
`GROUP BY column` 对列操作
没有分组的列不能被 `SELECT`，但可以选择用聚合函数
```
SELECT col1, aggregate_function(col2)  
FROM table_name  
GROUP BY column_name;
```

`HAVING` 在 **分组后** 过滤数据（作用于整个组）
```sql
SELECT col1,count(col) 
FROM table_name 
GROUP BY column_name 
HAVING count(col) > num 
```

`ORDER BY`  默认从小到大排序。搭配 `ASC` 表示升序，`DESC` 表示降序。可以用 `SELECT` 里的别名
```
ORDER BY column_name ASC
```


## 视图
`Create VIEW` 创建视图，视图和真实的表很相似，但它只存储查询代码
```sql
Create VIEW view_name AS <Query>

--用法
SELECT * from view_name
```
