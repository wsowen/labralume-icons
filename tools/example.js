// 使用示例

// 1. 在页面中使用
const iconManager = require('../../utils/icon-manager');

Page({
  data: {
    icons: {}
  },

  onLoad() {
    // 获取单个图标
    const homeIcon = iconManager.getIcon('home-active');

    // 批量获取图标
    const icons = iconManager.getIcons([
      'arrow-left',
      'arrow-right',
      'cart-default',
      'user-active'
    ]);

    this.setData({ icons });

    // 预加载图标（可选）
    iconManager.preload(['home-active', 'cart-active']);
  }
});

// 2. 在WXML中使用
<image src="{{icons['arrow-left']}}" class="icon" />

// 3. 导出使用统计（开发环境）
// 在app.js的onHide中调用
onHide() {
  const stats = iconManager.exportUsageStats();
  console.log('图标使用统计:', stats);
}
