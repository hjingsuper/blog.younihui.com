---
layout: post
title: BOM计算总重量
date: 2024-05-17
top: 1
categories: code
tags:
  - js
  - code
---

## 解决方案

```js
function calculateWeight(node) {
  let totalWeight = node.weight;
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      totalWeight += child.qty * calculateWeight(child);
    });
  }
  return totalWeight;
}
```

## 示例

```js
const bomTree =
  {
    pid: 0,
    id: 1,
    qty: 2,
    weight: 0.3263,
    children: [
      {
        pid: 1,
        id: 2,
        qty: 3,
        weight: 0.3625,
        children: [
          {
            pid: 2,
            id: 3,
            qty: 3,
            weight: 0.2154,
            children: [
              {
                pid: 3,
                id: 4,
                qty: 2,
                weight: 0.2589,
              }
            ]
          },
          {
            pid: 2,
            id: 31,
            qty: 1,
            weight: 0.5326,
          }
        ]
      }
    ]
  }
;

function calculateWeight(node) {
  let totalWeight = node.weight;
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      totalWeight += child.qty * calculateWeight(child);
    });
  }
  return totalWeight;
}

const rootNode = bomTree;
const totalWeight = calculateWeight(rootNode);
console.log(`Total weight of the root node: ${totalWeight.toFixed(4)}`);
```

## 解释

### BOM 树结构

```less
Node 1 (id: 1, qty: 2, weight: 0.3263)
  └── Node 2 (id: 2, qty: 3, weight: 0.3625)
        ├── Node 3 (id: 3, qty: 3, weight: 0.2154)
        │     └── Node 4 (id: 4, qty: 2, weight: 0.2589)
        └── Node 31 (id: 31, qty: 1, weight: 0.5326)
```

### 调用顺序和节点说明
1. **调用 `calculateWeight(rootNode)`**
   - `rootNode` 是 `Node 1` (id: 1, qty: 2, weight: 0.3263)
   - `totalWeight` 初始化为 0.3263
   - `Node 1` 有一个子节点 `Node 2`

2. **递归调用 `calculateWeight(Node 2)`**
   - `Node 2` (id: 2, qty: 3, weight: 0.3625)
   - `totalWeight` 初始化为 0.3625
   - `Node 2` 有两个子节点 `Node 3` 和 `Node 31`

3. **递归调用 `calculateWeight(Node 3)`**
   - `Node 3` (id: 3, qty: 3, weight: 0.2154)
   - `totalWeight` 初始化为 0.2154
   - `Node 3` 有一个子节点 `Node 4`

4. **递归调用 `calculateWeight(Node 4)`**
   - `Node 4` (id: 4, qty: 2, weight: 0.2589)
   - `totalWeight` 初始化为 0.2589
   - `Node 4` 没有子节点，返回 0.2589

5. **返回到 `Node 3`**
   - `child.qty * calculateWeight(child)` = 2 * 0.2589 = 0.5178
   - `totalWeight` = 0.2154 + 0.5178 = 0.7332
   - `Node 3` 返回 0.7332

6. **返回到 `Node 2`，继续处理 `Node 31`**
   - `Node 31` (id: 31, qty: 1, weight: 0.5326)
   - `totalWeight` 初始化为 0.5326
   - `Node 31` 没有子节点，返回 0.5326

7. **返回到 `Node 2`**
   - `child.qty * calculateWeight(child)` = 1 * 0.5326 = 0.5326
   - `totalWeight` = 0.3625 + 3 * 0.7332 + 0.5326 = 0.3625 + 2.1996 + 0.5326 = 3.0947
   - `Node 2` 返回 3.0947

8. **返回到 `Node 1`**
   - `child.qty * calculateWeight(child)` = 3 * 3.0947 = 9.2841
   - `totalWeight` = 0.3263 + 2 * 3.0947 = 0.3263 + 6.1894 = 6.5157
   - `Node 1` 返回 6.5157

### 计算过程总结

```yaml
Node 4:   0.2589
Node 3:   0.2154 + 2 * 0.2589 = 0.7332
Node 31:  0.5326
Node 2:   0.3625 + 3 * 0.7332 + 1 * 0.5326 = 3.0947
Node 1:   0.3263 + 2 * 3.0947 = 6.5157
```

### 输出结果
最后，根节点的总重量为 `6.5157`。

```javascript
const rootNode = bomTree[0];
const totalWeight = calculateWeight(rootNode);
console.log(`Total weight of the root node: ${totalWeight.toFixed(4)}`);
```

输出:
```
Total weight of the root node: 6.5157
```
