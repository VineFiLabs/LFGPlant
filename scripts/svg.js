<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 定义动态渐变背景 -->
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a8edea">
        <animate attributeName="stop-color" values="#a8edea;#fed6e3;#a8edea" dur="6s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#fed6e3">
        <animate attributeName="stop-color" values="#fed6e3;#a8edea;#fed6e3" dur="6s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <!-- 填充整个SVG背景 -->
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <!-- 居中显示“LFG”，字体样式使用默认的无衬线字体，可根据需要自定义 -->
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        fill="#ffffff" font-size="60">
    LFG
  </text>
</svg>
