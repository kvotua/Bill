let previousCoinState = {
  hasUser: false,
  currentPoints: 0,
  usePoints: 0,
  pointsPerRub: 0,
};

export function renderCoin(config) {
  const {
    hasUser = false,
    currentPoints = 0,
    usePoints = 0,
    pointsPerRub = 0,
  } = config;


  const container = document.getElementById('pointsContainer');
  if (!container) return;

  if (!hasUser) {
    container.style.display = 'none';
    previousCoinState = {
      hasUser: false,
      currentPoints: 0,
      usePoints: 0,
      pointsPerRub: 0,
    };
    return;
  }

  container.style.display = 'flex';

  const needsAnimation =
    previousCoinState.hasUser &&
    (previousCoinState.currentPoints !== currentPoints ||
      previousCoinState.usePoints !== usePoints ||
      previousCoinState.pointsPerRub !== pointsPerRub);

  if (needsAnimation) {
    updatePointsWithAnimation(currentPoints, usePoints, pointsPerRub);
  } else if (!previousCoinState.hasUser) {
    createPointsDisplay(currentPoints, usePoints, pointsPerRub);
  } else {
    createPointsDisplay(currentPoints, usePoints, pointsPerRub);
  }

  previousCoinState = { hasUser, currentPoints, usePoints, pointsPerRub };
}

function updatePointsWithAnimation(newPoints, newUsePoints, newPointsPerRub) {
  const pointsContainer = document.getElementById('pointsContainer');
  pointsContainer.classList.add('points-changing');

  const oldPoints = previousCoinState.currentPoints;
  const oldUsePoints = previousCoinState.usePoints;
  const oldPointsPerRub = previousCoinState.pointsPerRub;

  // ШАГ 1: Создаем разметку со ВСЕМИ элементами (даже скрытыми)
  createPointsDisplay(oldPoints, oldUsePoints, oldPointsPerRub);

  // ШАГ 2: Показываем/скрываем элементы в зависимости от новых значений
  updateElementsVisibility(newUsePoints, newPointsPerRub);

  // ШАГ 3: Анимируем числа
  setTimeout(() => {
    animateAllPoints(
      oldPoints,
      newPoints,
      oldUsePoints,
      newUsePoints,
      oldPointsPerRub,
      newPointsPerRub,
      () => {
        // После анимации обновляем финальные значения
        createPointsDisplay(newPoints, newUsePoints, newPointsPerRub);
        updateElementsVisibility(newUsePoints, newPointsPerRub);

        setTimeout(() => {
          pointsContainer.classList.remove('points-changing');
        }, 300);
      }
    );
  }, 50);
}

function updateElementsVisibility(usePoints, pointsPerRub) {
  // Управляем видимостью через CSS классы
  const useSection = document.getElementById('points-use-section');
  const earnSection = document.getElementById('points-earn-section');
  const finalSection = document.getElementById('points-final-section');
  const useOperator = document.getElementById('operator-use');
  const earnOperator = document.getElementById('operator-earn');
  const finalOperator = document.getElementById('operator-final');

  if (useSection) {
    useSection.style.display = usePoints > 0 ? 'flex' : 'none';
    if (useOperator)
      useOperator.style.display = usePoints > 0 ? 'inline' : 'none';
  }

  if (earnSection) {
    earnSection.style.display = pointsPerRub > 0 ? 'flex' : 'none';
    if (earnOperator)
      earnOperator.style.display = pointsPerRub > 0 ? 'inline' : 'none';
  }

  if (finalSection) {
    const shouldShow = usePoints > 0 || pointsPerRub > 0;
    finalSection.style.display = shouldShow ? 'flex' : 'none';
    if (finalOperator)
      finalOperator.style.display = shouldShow ? 'inline' : 'none';
  }
}

function animateAllPoints(
  startPoints,
  endPoints,
  startUsePoints,
  endUsePoints,
  startPointsPerRub,
  endPointsPerRub,
  onComplete
) {
  const duration = 800;
  const startTime = performance.now();

  function updateAnimation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);

    const currentPointsValue = Math.floor(
      startPoints + (endPoints - startPoints) * easeOutQuart
    );

    const currentUsePointsValue = Math.floor(
      startUsePoints + (endUsePoints - startUsePoints) * easeOutQuart
    );

    const currentPointsPerRubValue = Math.floor(
      startPointsPerRub + (endPointsPerRub - startPointsPerRub) * easeOutQuart
    );

    const currentFinalValue =
      currentPointsValue - currentUsePointsValue + currentPointsPerRubValue;

    // Обновляем ВСЕ числа, даже скрытые
    updateNumberElement('points-current', currentPointsValue);
    updateNumberElement('points-use', currentUsePointsValue);
    updateNumberElement('points-earn', currentPointsPerRubValue);
    updateNumberElement('points-final', currentFinalValue);

    if (progress < 1) {
      requestAnimationFrame(updateAnimation);
    } else if (onComplete) {
      onComplete();
    }
  }

  requestAnimationFrame(updateAnimation);
}

function updateNumberElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function createPointsDisplay(
  currentPoints,
  usePoints,
  pointsPerRub,
  finalPoints = null
) {
  const container = document.getElementById('pointsContainer');
  if (!container) return;

  if (finalPoints === null) {
    finalPoints = currentPoints - usePoints + pointsPerRub;
  }

  let equationHTML = '';

  // Текущие баллы (всегда видим)
  equationHTML += `
    <div class="equation-item">
      <div class="points-row">
        <span id="points-current" class="points-value">${currentPoints}</span>
        <img src="./assets/coinBack.png" class="coin-icon" />
      </div>
      <span class="points-label">у вас на счету</span>
    </div>
  `;

  // Списанные баллы (всегда в DOM, управляем видимостью)
  equationHTML += `<span id="operator-use" class="operator" style="display: ${usePoints > 0 ? 'inline' : 'none'}"> - </span>`;
  equationHTML += `
    <div id="points-use-section" class="equation-item" style="display: ${usePoints > 0 ? 'flex' : 'none'}">
      <div class="points-row">
        <span id="points-use" class="points-value">${usePoints}</span>
        <img src="./assets/coinBack.png" class="coin-icon" />
      </div>
      <span class="points-label">списано</span>
    </div>
  `;

  // Накопленные баллы (всегда в DOM, управляем видимостью)
  equationHTML += `<span id="operator-earn" class="operator" style="display: ${pointsPerRub > 0 ? 'inline' : 'none'}"> + </span>`;
  equationHTML += `
    <div id="points-earn-section" class="equation-item" style="display: ${pointsPerRub > 0 ? 'flex' : 'none'}">
      <div class="points-row">
        <span id="points-earn" class="points-value">${pointsPerRub}</span>
        <img src="./assets/coinBack.png" class="coin-icon" />
      </div>
      <span class="points-label">накопите</span>
    </div>
  `;

  // Итоговые баллы (всегда в DOM, управляем видимостью)
  const showFinal = usePoints > 0 || pointsPerRub > 0;
  equationHTML += `<span id="operator-final" class="operator" style="display: ${showFinal ? 'inline' : 'none'}"> = </span>`;
  equationHTML += `
    <div id="points-final-section" class="equation-item" style="display: ${showFinal ? 'flex' : 'none'}">
      <div class="points-row">
        <span id="points-final" class="points-value final">${finalPoints}</span>
        <img src="./assets/coinBack.png" class="coin-icon" />
      </div>
      <span class="points-label">станет</span>
    </div>
  `;

  container.innerHTML = equationHTML;
}
