---
layout: post
title: 子等于父 树结构生成
date: 2024-05-24
top: 1
categories: code
tags:
  - c#
---

# 子等于父 树结构生成

> 正常情况下最顶层的pid不是0就是null，特殊业务下id可能等于fid

```csharp
//实体
public class Tree
{

   [SqlSugar.SugarColumn(IsPrimaryKey =true)]
   public int Id { get; set; } //关联字段 默认是主键
   public string Name { get; set; }
   public int ParentId { get; set; }//父级字段
   [SqlSugar.SugarColumn(IsIgnore = true)]
   public List<Tree> Child { get; set; }
}

void BuildTree(){
    var rootNodes = list.Where(t => t.Id == t.ParentId).ToList();
    list.RemoveAll(t => t.Id == t.ParentId);
    Dictionary<string, List<Tree>> dict = list.GroupBy(t => t.ParentId).ToDictionary(g => g.Key, g => g.ToList());

    List<Tree> tree = new List<Tree>();

    foreach (var rootNode in rootNodes)
    {
        var newRootNode = rootNode.DeepCopy();
        BuildSubTree(dict, newRootNode);
        tree.Add(newRootNode);
    }
}

void BuildSubTree(Dictionary<string, List<Tree>> dict, Tree parent)
{
    if (dict.TryGetValue(parent.Id, out var children))
    {
        foreach (var childNode in children)
        {
            var newChildNode = childNode.DeepCopy();
            parent.children.Add(newChildNode);
            BuildSubTree(dict, newChildNode);
        }
    }
}

```

