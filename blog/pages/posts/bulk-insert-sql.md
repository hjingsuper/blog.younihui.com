---
layout: post
title: 一对多-动态生成插入语句
date: 2024-05-24
top: 1
categories: code
tags:
  - sql
---

# 批量一对多插入

## 示例数据

| CheckClass | CheckClassCode | CheckId | CheckIdCode | CheckDept | CheckUserId | CheckUserName |
|------------|----------------|---------|-------------|-----------|-------------|---------------|
| 审查         | Check01        | 项目管理担当  | Check01.01  | 开发中心      | 1           | 111           |
| 会签         | Check02        | 设计经理    | Check02.01  | 开发中心      | 2           | 222           |
| 会签         | Check02        | 部品技术    | Check02.02  | 部品技术部     | 3           | 333           |
| 会签         | Check02        | 部品技术    | Check02.02  | 部品技术部     | 4           | 444           |
| 会签         | Check02        | 生产准备    | Check02.03  | 制品技术部     | 5           | 555           |
| 会签         | Check02        | 生产准备    | Check02.03  | 制品技术部     | 6           | 666           |
| 确认         | Check03        | 项目管理经理  | Check03.01  | 开发中心      | 7           | 777           |
| 承认         | Check04        | 开发中心长   | Check04.01  | 开发中心      | 8           | 888           |
| 实施         | Check05        | 生产关联部署  | Check05.01  | 威海技术      | 9           | 999           |
| 实施         | Check05        | 生产关联部署  | Check05.01  | 威海技术      | 10          | 1110          |
| 实施         | Check05        | 生产关联部署  | Check05.01  | 威海技术      | 11          | 1221          |
| 实施         | Check05        | 生产关联部署  | Check05.01  | 威海营业      | 12          | 1332          |

#### 每行数据需要对应多个机型，字段Product_Model

062K 30614、062K 31284、062K 31294、062K 31304、062K 31653、062K 31684、062K 32303、062K 32313、062K 32323、062K 32333、062K 32343、062K 32983

## sql批量插入

```sql
-- 针对每个机型生成的SQL语句
DECLARE @models TABLE (Product_Model NVARCHAR(20));
INSERT INTO @models VALUES (N'062K 30614'), (N'062K 31284'), (N'062K 31294'), (N'062K 31304'), (N'062K 31653'), (N'062K 31684'),
                           (N'062K 32303'), (N'062K 32313'), (N'062K 32323'), (N'062K 32333'), (N'062K 32343'), (N'062K 32983');

-- 动态生成插入语句
INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'审查', N'项目管理担当', Product_Model, N'开发中心', N'1', N'陈伟', N'111', getdate(), 1, 0, N'Check01', N'Check01.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'会签', N'设计经理', Product_Model, N'开发中心', N'2', N'陈亮国', N'222', getdate(), 1, 0, N'Check02', N'Check02.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'会签', N'部品技术', Product_Model, N'部品技术部', N'3', N'徐琴琴', N'333', getdate(), 1, 0, N'Check02', N'Check02.02' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'会签', N'部品技术', Product_Model, N'部品技术部', N'4', N'刘志有', N'444', getdate(), 1, 0, N'Check02', N'Check02.02' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'会签', N'生产准备', Product_Model, N'制品技术部', N'5', N'郁文进', N'555', getdate(), 1, 0, N'Check02', N'Check02.03' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'会签', N'生产准备', Product_Model, N'制品技术部', N'6', N'周静', N'666', getdate(), 1, 0, N'Check02', N'Check02.03' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'确认', N'项目管理经理', Product_Model, N'开发中心', N'7', N'陈伟', N'777', getdate(), 1, 0, N'Check03', N'Check03.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'承认', N'开发中心长', Product_Model, N'开发中心', N'8', N'山冈胜', N'888', getdate(), 1, 0, N'Check04', N'Check04.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'实施', N'生产关联部署', Product_Model, N'威海技术', N'9', N'宋鲁宁', N'999', getdate(), 1, 0, N'Check05', N'Check05.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'实施', N'生产关联部署', Product_Model, N'威海技术', N'10', N'谢婧', N'1110', getdate(), 1, 0, N'Check05', N'Check05.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'实施', N'生产关联部署', Product_Model, N'威海技术', N'11', N'毛毛雪', N'1221', getdate(), 1, 0, N'Check05', N'Check05.01' FROM @models;

INSERT INTO ECO_ECOCheckSetup (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT N'实施', N'生产关联部署', Product_Model, N'威海营业', N'12', N'岳燕', N'1332', getdate(), 1, 0, N'Check05', N'Check05.01' FROM @models;

```

## 解释


### 使用表变量存储产品型号

首先，我们使用表变量 `@models` 来存储所有的产品型号。这种方式可以方便地对多个型号进行操作，而不需要重复编写相同的SQL代码：

```sql
DECLARE @models TABLE (Product_Model NVARCHAR(20));
INSERT INTO @models VALUES
    (N'062K 30614'), (N'062K 31284'), (N'062K 31294'),
    (N'062K 31304'), (N'062K 31653'), (N'062K 31684'),
    (N'062K 32303'), (N'062K 32313'), (N'062K 32323'),
    (N'062K 32333'), (N'062K 32343'), (N'062K 32983');
```

### 动态生成插入语句

通过使用 `SELECT ... FROM @models`，我们可以针对每个产品型号生成相同的插入语句，而不需要为每个型号手动编写插入语句

```sql
INSERT INTO ECO_ECOCheckSetup
    (CheckClass, CheckId, Product_Model, CheckDept, CheckUserId, CheckUserName, Create_By, Create_Date, IsEnable, IsReplacer, CheckClassCode, CheckIdCode)
SELECT
    N'审查', N'项目管理担当', Product_Model, N'开发中心', N'sj034741', N'陈伟',
    N'999999', getdate(), 1, 0, N'Check01', N'Check01.01'
FROM @models;
```

在上述代码中，`SELECT ... FROM @models` 会针对 `@models` 表中的每个 `Product_Model` 值执行一次 `INSERT` 操作。这样，我们只需编写一次插入逻辑，就可以对所有的产品型号执行相同的操作。

### 优点

1. **减少冗余代码**：避免为每个产品型号重复编写相同的插入语句。
2. **提高可维护性**：如果需要更改插入逻辑或增加新的产品型号，只需修改一处代码即可。
3. **简化操作**：通过表变量和 `SELECT ... FROM` 语句，操作更加简洁明了。

