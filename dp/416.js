// LeetCode 416: 分割等和子集 (Partition Equal Subset Sum)
// 题目：给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

/**
 * 判断数组是否可以分割成两个和相等的子集
 * 使用动态规划解决子集和问题
 * 找到一个集合总和为sum的一半，就能找到另外一半的集合
 *
 * @param {number[]} nums - 只包含正整数的非空数组
 * @return {boolean} - 是否可以分割成两个等和子集
 */
var canPartition = function(nums) {
    // 计算数组总和
    // let sum = 0;
    // for (let num of nums) {
    //     sum += num;
    // }
    const sum = nums.reduce((a, b) => a + b, 0)

    // 如果总和为奇数，无法分成两个相等的子集
    if (sum % 2 !== 0) {
        return false;
    }

    // 目标和为总和的一半
    const target = sum / 2;

    // dp[i] 表示是否存在子集的和等于 i
    // dp数组大小为 target + 1，因为我们只需要考虑 0 到 target 的和
    const dp = Array(target + 1).fill(false);
    dp[0] = true; // 空子集的和为 0，总是存在

    // 遍历每个数字，更新dp数组
    for (let num of nums) {
        // 从后往前遍历，避免重复使用同一个数字
        // 这里的关键是 i 从 target 递减到 num，确保每个数字只使用一次
        for (let i = target; i >= num; i--) {
            // 状态转移方程：
            // dp[i] = dp[i] || dp[i - num]
            // 如果不使用当前数字，dp[i] 保持原值
            // 如果使用当前数字，检查 dp[i - num] 是否为 true
            dp[i] = dp[i] || dp[i - num];
        }
    }

    // 返回是否存在和为 target 的子集
    return dp[target];
};