# 背包问题详解 (JavaScript实现)

## 背包问题简介

背包问题是动态规划中的经典问题，主要用于解决在给定容量限制下，如何选择物品以获得最大价值的问题。根据物品的选择限制和问题约束，背包问题可以分为多种类型。

## 1. 0-1 背包问题

### 问题描述
有n件物品，第i件物品的重量是weight[i]，价值是value[i]。背包容量为capacity，每件物品最多选择一次，求最大总价值。

### 动态规划解法

#### 二维DP
```javascript
function knapsack01_2D(capacity, weights, values) {
    const n = weights.length;
    // dp[i][w]表示前i件物品在容量为w时的最大价值
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // 不选第i件物品
            dp[i][w] = dp[i - 1][w];

            // 如果容量允许，选择第i件物品
            if (w >= weights[i - 1]) {
                dp[i][w] = Math.max(dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        }
    }

    return dp[n][capacity];
}
```

#### 一维优化（空间压缩）
```javascript
function knapsack01(capacity, weights, values) {
    // dp[w]表示容量为w时的最大价值
    const dp = Array(capacity + 1).fill(0);

    for (let i = 0; i < weights.length; i++) {
        // 关键：容量循环必须递减（从大到小）
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}
```

### 示例
```javascript
const capacity = 50;
const weights = [10, 20, 30];
const values = [60, 100, 120];

console.log(knapsack01(capacity, weights, values)); // 输出: 220
```

## 2. 完全背包问题

### 问题描述
物品可以无限次选择，其他条件与0-1背包相同。

### 解法实现
```javascript
function completeKnapsack(capacity, weights, values) {
    const dp = Array(capacity + 1).fill(0);

    for (let i = 0; i < weights.length; i++) {
        // 关键：容量循环递增（从小到大）
        for (let w = weights[i]; w <= capacity; w++) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}
```

### 示例
```javascript
const capacity = 10;
const weights = [2, 3, 4];
const values = [3, 4, 5];

console.log(completeKnapsack(capacity, weights, values)); // 输出: 15
```

## 3. 多重背包问题

### 问题描述
每件物品最多选择s[i]次。

### 解法实现

#### 朴素解法
```javascript
function boundedKnapsack_naive(capacity, weights, values, counts) {
    const dp = Array(capacity + 1).fill(0);

    for (let i = 0; i < weights.length; i++) {
        for (let k = 0; k < counts[i]; k++) {
            for (let w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
    }

    return dp[capacity];
}
```

#### 二进制拆分优化
```javascript
function boundedKnapsack(capacity, weights, values, counts) {
    // 将多重背包拆分为0-1背包
    const newWeights = [];
    const newValues = [];

    for (let i = 0; i < weights.length; i++) {
        let count = counts[i];

        // 二进制拆分：1, 2, 4, 8, ...
        for (let k = 1; count > 0; k <<= 1) {
            const use = Math.min(k, count);
            newWeights.push(weights[i] * use);
            newValues.push(values[i] * use);
            count -= use;
        }
    }

    // 转化为0-1背包问题
    return knapsack01(capacity, newWeights, newValues);
}
```

### 示例
```javascript
const capacity = 10;
const weights = [2, 3, 4];
const values = [3, 4, 5];
const counts = [2, 3, 1];

console.log(boundedKnapsack(capacity, weights, values, counts)); // 输出: 13
```

## 4. 分组背包问题

### 问题描述
物品分成若干组，每组最多选择一件物品。

### 解法实现
```javascript
function groupKnapsack(capacity, groups) {
    const dp = Array(capacity + 1).fill(0);

    for (const group of groups) {
        // 每组做一次0-1背包
        for (let w = capacity; w >= 0; w--) {
            for (const item of group) {
                if (w >= item.weight) {
                    dp[w] = Math.max(dp[w],
                        dp[w - item.weight] + item.value);
                }
            }
        }
    }

    return dp[capacity];
}

// groups格式：[[{weight: 2, value: 3}, {weight: 3, value: 4}], ...]
```

## 5. 混合背包问题

### 问题描述
同时包含0-1、完全、多重背包的混合问题。

### 解法实现
```javascript
function mixedKnapsack(capacity, items) {
    const dp = Array(capacity + 1).fill(0);

    for (const item of items) {
        if (item.type === '01') {
            // 0-1背包：递减循环
            for (let w = capacity; w >= item.weight; w--) {
                dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
            }
        } else if (item.type === 'complete') {
            // 完全背包：递增循环
            for (let w = item.weight; w <= capacity; w++) {
                dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
            }
        } else if (item.type === 'bounded') {
            // 多重背包：二进制拆分
            const splitItems = binarySplit(item);
            for (const splitItem of splitItems) {
                for (let w = capacity; w >= splitItem.weight; w--) {
                    dp[w] = Math.max(dp[w],
                        dp[w - splitItem.weight] + splitItem.value);
                }
            }
        }
    }

    return dp[capacity];
}

function binarySplit(item) {
    const result = [];
    let count = item.count;

    for (let k = 1; count > 0; k <<= 1) {
        const use = Math.min(k, count);
        result.push({
            weight: item.weight * use,
            value: item.value * use
        });
        count -= use;
    }

    return result;
}
```

## 6. 二维背包问题

### 问题描述
背包有两个维度的限制（如重量和体积）。

### 解法实现
```javascript
function knapsack2D(capacity1, capacity2, weights1, weights2, values) {
    const n = weights1.length;
    const dp = Array(capacity1 + 1).fill().map(() =>
        Array(capacity2 + 1).fill(0)
    );

    for (let i = 0; i < n; i++) {
        for (let w1 = capacity1; w1 >= weights1[i]; w1--) {
            for (let w2 = capacity2; w2 >= weights2[i]; w2--) {
                dp[w1][w2] = Math.max(dp[w1][w2],
                    dp[w1 - weights1[i]][w2 - weights2[i]] + values[i]);
            }
        }
    }

    return dp[capacity1][capacity2];
}
```

## 7. 常见变体问题

### 7.1 恰好装满
```javascript
function knapsackExact(capacity, weights, values) {
    const dp = Array(capacity + 1).fill(-Infinity);
    dp[0] = 0;

    for (let i = 0; i < weights.length; i++) {
        for (let w = capacity; w >= weights[i]; w--) {
            if (dp[w - weights[i]] !== -Infinity) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
    }

    return dp[capacity] === -Infinity ? -1 : dp[capacity];
}
```

### 7.2 方案计数
```javascript
function knapsackCount(capacity, weights, values) {
    const dp = Array(capacity + 1).fill(0);
    const cnt = Array(capacity + 1).fill(0);
    dp[0] = 0;
    cnt[0] = 1;

    for (let i = 0; i < weights.length; i++) {
        for (let w = capacity; w >= weights[i]; w--) {
            if (dp[w] < dp[w - weights[i]] + values[i]) {
                dp[w] = dp[w - weights[i]] + values[i];
                cnt[w] = cnt[w - weights[i]];
            } else if (dp[w] === dp[w - weights[i]] + values[i]) {
                cnt[w] += cnt[w - weights[i]];
            }
        }
    }

    return { maxValue: dp[capacity], count: cnt[capacity] };
}
```

### 7.3 最小重量达到指定价值
```javascript
function knapsackMinWeight(targetValue, weights, values) {
    const maxValue = values.reduce((sum, val) => sum + val, 0);
    const dp = Array(maxValue + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 0; i < weights.length; i++) {
        for (let v = maxValue - values[i]; v >= 0; v--) {
            dp[v + values[i]] = Math.min(dp[v + values[i]],
                dp[v] + weights[i]);
        }
    }

    return dp[targetValue] === Infinity ? -1 : dp[targetValue];
}
```

## 总结

### 关键要点
1. **循环方向**：0-1背包递减，完全背包递增
2. **状态定义**：明确dp数组的含义
3. **转移方程**：根据问题类型选择正确的状态转移
4. **边界条件**：注意初始化和特殊情况
5. **优化技巧**：二进制拆分、滚动数组等

### 复杂度对比
| 类型 | 时间复杂度 | 空间复杂度 | 特点 |
|------|------------|------------|------|
| 0-1背包 | O(nC) | O(C) | 每个物品选一次 |
| 完全背包 | O(nC) | O(C) | 物品可选无限次 |
| 多重背包 | O(nClogS) | O(C) | 二进制拆分优化 |
| 二维背包 | O(nC1C2) | O(C1C2) | 多个容量约束 |

选择合适的背包类型和优化技巧是解决问题的关键！