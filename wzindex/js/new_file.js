<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>

// 创建对象池用于管理图片放大展示时创建的元素
const overlayPool = [];
const enlargedImagePool = [];

function createOverlayAndEnlargedImage() {
    let overlay;
    let enlargedImage;

    // 先从对象池获取元素，如果没有则创建新的
    if (overlayPool.length > 0) {
        overlay = overlayPool.pop();
    } else {
        overlay = document.createElement('div');
        overlay.classList.add('image-overlay');
    }

    if (enlargedImagePool.length > 0) {
        enlargedImage = enlargedImagePool.pop();
    } else {
        enlargedImage = document.createElement('img');
        enlargedImage.classList.add('enlarged-img');
    }

    document.body.appendChild(overlay);
    overlay.appendChild(enlargedImage);

    return { overlay, enlargedImage };
}

function returnElementsToPool(overlay, enlargedImage) {
    // 将元素放回对象池
    overlayPool.push(overlay);
    enlargedImagePool.push(enlargedImage);

    // 从文档中移除元素
    overlay.remove();
    enlargedImage.remove();
}

// 在页面加载完成时隐藏加载动画
window.addEventListener('load', function () {
    document.getElementById('loading-overlay').style.display = 'none';
});

// 获取所有导航链接
const navLinks = document.querySelectorAll('nav a');

// 为每个导航链接添加点击事件监听器
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // 阻止默认的链接跳转行为

        const targetId = this.getAttribute('href'); // 获取目标元素的ID
        const targetElement = document.querySelector(targetId); // 根据ID获取目标元素

        if (targetElement) {
            // 计算目标元素相对于顶部的偏移量
            const targetOffset = targetElement.offsetTop;

            // 使用window.scrollTo实现平滑滚动
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        }
    });
});

// 获取所有在.tpk和.fq中的图片元素
const allImages = document.querySelectorAll('.tpk img,.fq img');

// 为每个图片添加点击事件监听器
allImages.forEach(image => {
    image.addEventListener('click', function () {
        const { overlay, enlargedImage } = createOverlayAndEnlargedImage();

        enlargedImage.src = this.src;

        // 计算图片放大后的尺寸和位置，使其在屏幕居中
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const imgWidth = this.width;
        const imgHeight = this.height;
        const scaleFactor = Math.min(windowWidth / imgWidth, windowHeight / imgHeight);
        const newWidth = imgWidth * scaleFactor;
        const newHeight = imgHeight * scaleFactor;
        const left = (windowWidth - newWidth) / 2;
        const top = (windowHeight - newHeight) / 2;

        // 设置放大图片的初始样式（隐藏且大小位置为计算值）
        enlargedImage.style.width = `${newWidth}px`;
        enlargedImage.style.height = `${newHeight}px`;
        enlargedImage.style.left = `${left}px`;
        enlargedImage.style.top = `${top}px`;
        enlargedImage.style.opacity = '0';
        enlargedImage.style.transform = 'scale(0)';

        // 添加一个类来触发放大展示的动画效果
        enlargedImage.classList.add('show-img');

        // 添加点击事件监听器到覆盖层，点击时关闭放大展示
        overlay.addEventListener('click', function () {
            // 移除类来触发关闭动画效果
            enlargedImage.classList.remove('show-img');

            // 将元素放回对象池
            returnElementsToPool(overlay, enlargedImage);
        });
    });
});

// 获取所有要懒加载的图片元素
const lazyLoadImages = document.querySelectorAll('.lazy-load-img');

// 定义一个函数用于检查图片是否进入可视区域并加载图片
function lazyLoad() {
    lazyLoadImages.forEach(image => {
        const rect = image.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowTop = window.pageYOffset;

        if (rect.top < windowHeight + windowTop && rect.bottom > windowTop) {
            // 图片进入可视区域，显示加载元素并加载真实图片
            const loadingElement = image.nextElementSibling;
            loadingElement.style.display = 'block';

            const src = image.getAttribute('data-src');
            const img = new Image();
            img.src = src;

            img.onload = function () {
                // 图片加载完成，隐藏加载元素，显示图片并设置过渡效果
                loadingElement.style.display = 'none';
                image.src = src;
                image.style.opacity = '1';
                image.style.visibility = 'visible';
                image.style.transition = 'opacity 0.5s ease';
            };

            img.onerror = function () {
                // 图片加载出错，显示默认错误图片并隐藏加载元素
                const errorImgSrc = './img/error-image.png'; // 替换为实际的错误图片路径
                image.src = errorImgSrc;
                image.style.opacity = '1';
                image.style.visibility = 'visible';
                const loadingElement = image.nextElementSibling;
                loadingElement.style.display = 'none';
            };
        }
    });
}

// 对懒加载函数进行节流处理，每200毫秒执行一次检查
const lazyLoadThrottled = _.throttle(lazyLoad, 200);

// 页面加载时和滚动时都检查图片是否需要加载
window.addEventListener('load', lazyLoadThrottled);
window.addEventListener('scroll', lazyLoadThrottled);

// 获取返回顶部按钮元素
const backToTopButton = document.getElementById('back-to-top');

// 定义一个函数用于检查页面滚动位置并控制按钮显示
function checkScrollPosition() {
    const scrollTop = window.scrollY;
    if (scrollTop > 200) {
        backToTopButton.style.display = 'visible';
    } else {
        backToTopButton.style.display = 'none';
    }
}

// 页面加载时检查一次滚动位置
window.addEventListener('load', checkScrollPosition);

// 页面滚动时实时检查滚动位置并控制按钮显示
window.addEventListener('scroll', checkScrollPosition);

// 给返回顶部按钮添加点击事件监听器，实现返回顶部功能
backToTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});