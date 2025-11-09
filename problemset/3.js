/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // 滑动窗口 + 哈希表（记录每个字符最近出现的位置）
    const map = new Map()
    // start：当前窗口左边界（确保 [start..i] 无重复）；max：最长不重复子串长度
    let max = 0, start = 0;
    // i 为窗口右边界，遍历字符串每个字符
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        // 如果字符 c 在窗口内已经出现过，则需要移动左边界
        // 移动到该字符上次出现位置的下一位，以保证窗口内无重复
        // 注意要取 Math.max，因为 start 不能回退（保持窗口合法）
        if (map.has(c)) {
            start = Math.max(start, map.get(c) + 1);
        }
        // 更新最长长度：当前窗口大小为 i - start + 1
        max = Math.max(max, i - start + 1);
        // 记录/更新当前字符最近出现的位置为 i
        map.set(c, i)
    }

    return max;
};

/**
 * 双指针 + Set 解法
 * 维护不含重复字符的窗口 [l..r]：
 * - 右指针 r 每次尝试加入字符 s[r] 到集合。
 * - 若 s[r] 已在集合中，说明出现重复；从左指针开始依次移出字符并右移 l，直到集合不含 s[r]。
 * - 加入 s[r] 后，更新当前最大长度 max = max(max, r - l + 1)。
 * 复杂度：时间 O(n)，空间 O(U)（U 为字符种类数）；常数较低、实现直观。
 */
function lengthOfLongestSubstring(s) {
  const set = new Set();
  let l = 0, max = 0;
  for (let r = 0; r < s.length; r++) {
    while (set.has(s[r])) {
      set.delete(s[l]);
      l++;
    }
    set.add(s[r]);
    max = Math.max(max, r - l + 1);
  }
  return max;
}