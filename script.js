// ---------- 설정값 ----------
const BLOSSOM_COUNT = 40;   // 화면에 동시에 보일 벚꽃 수
const AVOID_RADIUS  = 80;   // 커서 반경(px) 안에 오면 피하기
const AVOID_SPEED   = 0.35; // 피하는 정도 (0~1)

// ---------- 벚꽃 생성 ----------
document.addEventListener('DOMContentLoaded', () => {
  const layer = document.getElementById('blossom-layer');
  const fragment = document.createDocumentFragment();
  const classes = ['small', '', 'large']; // 크기 다양화

  for (let i = 0; i < BLOSSOM_COUNT; i++) {
    const bloom = document.createElement('div');
    bloom.className = `blossom ${classes[i % classes.length]}`;
    bloom.textContent = '🌸';                        // 이모지 사용
    resetBlossom(bloom, true);
    fragment.appendChild(bloom);
  }
  layer.appendChild(fragment);
});

// ---------- 커서 회피 ----------
document.addEventListener('mousemove', ({ clientX: mx, clientY: my }) => {
  document.querySelectorAll('.blossom').forEach(el => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = cx - mx;
    const dy = cy - my;
    const dist = Math.hypot(dx, dy);

    if (dist < AVOID_RADIUS) {
      const factor = (AVOID_RADIUS - dist) / AVOID_RADIUS * AVOID_SPEED;
      el.style.transform += ` translate(${dx * factor}px, ${dy * factor}px)`;
    }
  });
});

// ---------- 끝까지 떨어지면 위로 재배치 ----------
document.addEventListener('animationiteration', (e) => {
  if (e.target.classList.contains('blossom'))
    resetBlossom(e.target, false);
});

// ---------- 유틸: 초기화 & 재배치 ----------
function resetBlossom(el, firstTime) {
  const vw = window.innerWidth;
  const sway = (Math.random() * 40 + 20) * (Math.random() < 0.5 ? -1 : 1); // 좌우 흔들 폭
  const startX = Math.random() * vw - vw / 2;                               // 시작 X 오프셋

  el.style.setProperty('--start-x', `${startX}px`);
  el.style.setProperty('--sway', `${sway}px`);
  el.style.setProperty('--duration', `${Math.random() * 5 + 6}s`);

  // 재배치 시 살짝 딜레이 주기
  if (!firstTime) {
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.animation = '';
      });
    });
  }
}
