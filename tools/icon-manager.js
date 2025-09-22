/**
 * LabraLume CDN图标管理器
 *
 * 使用方法：
 * const iconManager = require('./icon-manager');
 * const iconUrl = iconManager.getIcon('arrow-left');
 */

class IconManager {
  constructor() {
    // CDN基础URL
    this.baseUrl = 'https://cdn.jsdelivr.net/gh/wsowen/labralume-icons@v1.0.0/icons/all';

    // 缓存已使用的图标URL
    this.cache = new Map();

    // 追踪使用的图标（开发环境）
    this.usedIcons = new Set();
  }

  /**
   * 获取图标URL
   * @param {string} name - 图标名称（不含.png后缀）
   * @returns {string} 完整的CDN URL
   */
  getIcon(name) {
    // 添加.png后缀
    if (!name.endsWith('.png')) {
      name = `${name}.png`;
    }

    // 检查缓存
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }

    // 生成URL
    const url = `${this.baseUrl}/${name}`;

    // 缓存URL
    this.cache.set(name, url);

    // 记录使用情况（用于后续优化）
    this.trackUsage(name);

    return url;
  }

  /**
   * 批量获取图标
   * @param {Array<string>} names - 图标名称数组
   * @returns {Object} 图标名称到URL的映射
   */
  getIcons(names) {
    const result = {};
    names.forEach(name => {
      result[name] = this.getIcon(name);
    });
    return result;
  }

  /**
   * 预加载图标
   * @param {Array<string>} names - 要预加载的图标名称
   * @returns {Promise}
   */
  async preload(names) {
    const promises = names.map(name => {
      const url = this.getIcon(name);
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: () => resolve({ name, success: true }),
          fail: (err) => resolve({ name, success: false, error: err })
        });
      });
    });

    return Promise.all(promises);
  }

  /**
   * 追踪图标使用情况
   * @private
   */
  trackUsage(name) {
    this.usedIcons.add(name);

    // 开发环境输出统计
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`[IconManager] 已使用图标: ${this.usedIcons.size}个`);
    }
  }

  /**
   * 导出使用统计（用于优化）
   */
  exportUsageStats() {
    return {
      total: this.usedIcons.size,
      icons: Array.from(this.usedIcons)
    };
  }
}

// 导出单例
module.exports = new IconManager();
