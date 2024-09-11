 let cards = [];
    let array = [];
    const arrayContainer = document.getElementById('arrCont');
    const progressFill = document.getElementById('progFill');
    const speedControl = document.getElementById('speedCtrl');
    const speedLabel = document.getElementById('speedLbl');
    const completeMessage = document.getElementById('compMsg');
    let sortSpeed = 500;

    document.getElementById('genArr').addEventListener('click', function() {
      const numElements = parseInt(document.getElementById('numElems').value);
      array = Array.from({ length: numElements }, (_, i) => i + 1);
      renderCards(array);
    });
    document.getElementById('genRandArr').addEventListener('click', function() {
      const numElements = parseInt(document.getElementById('numElems').value);
      array = Array.from({ length: numElements }, () => Math.floor(Math.random() * 100));
      renderCards(array);
    });
    speedControl.addEventListener('input', function() {
      sortSpeed = 1000 / speedControl.value;
      speedLabel.innerText = `Speed: ${speedControl.value}`;
    });
    function renderCards(array) {
      arrayContainer.innerHTML = '';
      cards = array.map((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.draggable = true;
        card.innerText = value;
        card.dataset.idx = index;
        addDragEvents(card);
        arrayContainer.appendChild(card);
        return card;
      });
    }
    function addDragEvents(card) {
      card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      card.addEventListener('dragover', (event) => {
        event.preventDefault();
      });
      card.addEventListener('drop', (event) => {
        event.preventDefault();
        const draggedCard = document.querySelector('.dragging');
        const draggedIndex = Array.from(arrayContainer.children).indexOf(draggedCard);
        const targetIndex = Array.from(arrayContainer.children).indexOf(card);
        [array[draggedIndex], array[targetIndex]] = [array[targetIndex], array[draggedIndex]];
        renderCards(array);
      });
    }
    document.getElementById('sortArr').addEventListener('click', async function() {
      await bubbleSort(array);
    });
    async function bubbleSort(array) {
      let n = array.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          highlightComparison(j, j + 1);
          if (array[j] > array[j + 1]) {
            await sleep(sortSpeed);
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            renderCards(array);
            highlightSwap(j, j + 1);
            await sleep(sortSpeed);
            removeHighlightSwap(j, j + 1);
          }
          removeHighlightComparison(j, j + 1);
        }
        markSorted(n - i - 1);
        updateProgressBar(i + 1, n);
      }
      markSorted(0);
      completeMessage.style.display = 'block';
    }
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    function highlightComparison(index1, index2) {
      cards[index1].classList.add('comparing');
      cards[index2].classList.add('comparing');
    }
    function removeHighlightComparison(index1, index2) {
      cards[index1].classList.remove('comparing');
      cards[index2].classList.remove('comparing');
    }
    function highlightSwap(index1, index2) {
      cards[index1].classList.add('swapping');
      cards[index2].classList.add('swapping');
    }
    function removeHighlightSwap(index1, index2) {
      cards[index1].classList.remove('swapping');
      cards[index2].classList.remove('swapping');
    }
    function markSorted(index) {
      cards[index].classList.add('sorted');
    }
    function updateProgressBar(completed, total) {
      progressFill.style.width = `${(completed / total) * 100}%`;
    }
