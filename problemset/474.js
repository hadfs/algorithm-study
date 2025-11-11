/**
 * 动态规划公式
 * dp[m][n] = 最大子集个数
 * dp[i][j] = 不选当前str  = dp[i][j]，选当前str = dp[i - count][j - count] + 1
 * dp[i][j] = max(dp[i][j], dp[i - zeroCount][i - oneCount] + 1)
 */
var findMaxForm = function(strs, m, n) {
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
    for (let str of strs) {
        let a = 0, b = 0
        for (let c of str) {
            if (c === '0') {
                a++
            } else {
                b++
            }
        }
        for (let i = m; i >= a; i--) {
            for (let j = n; j >= b; j--) {
                dp[i][j] = Math.max(dp[i][j], dp[i - a][j - b] + 1)
            }
        }
    }

    return dp[m][n]
};