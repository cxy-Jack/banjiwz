        const header = document.querySelector('header');
        const img = document.querySelector('.img');
        let scrollDistance = 0;
        let requestId = null;
        function updateHeaderClipPath() {
            const clipPathValue = `polygon(0 0, 100% 0%, 100% ${(scrollDistance <= 600) ? 100 - ((scrollDistance / 600) * 60) : 75}%, 0 100%)`;
            header.style.clipPath = clipPathValue;
            const scaleValue = 1 + ((scrollDistance / 600) * 1);
            img.style.transform = `scale(${scaleValue})`;
            const opacityValue = (scrollDistance / 600);
        }
        function scrollHandler(event) {
            if (event.deltaY < 0) {
                scrollDistance = Math.max(0, scrollDistance + event.deltaY);
            } else {
                scrollDistance = Math.min(600, scrollDistance + event.deltaY);
            }
            if (!requestId) {
                requestId = window.requestAnimationFrame(() => {
                    updateHeaderClipPath();
                    requestId = null;
                });
            }
        }
        window.addEventListener('wheel', scrollHandler);
		
		document.addEventListener('copy', (e) => {
			// 获取当前选中的文本内容
			let selectedText = window.getSelection().toString();
		
			// 将选中的文本内容设置到剪贴板
			e.clipboardData.setData('text/plain', selectedText);
		
			// 显示复制成功的提示
			alert('嘻嘻~网址/内容复制成功啦~Ծ‸Ծ');
		
			// 可以选择是否继续在控制台输出相关信息，这里保留了原有的控制台输出示例
			console.log('复制网址/或内容');
		});
		// 获取分享按钮元素
		const shareUrlButton = document.getElementById('shareUrlButton');
		
		shareUrlButton.addEventListener('click', function () {
		    // 判断浏览器是否支持原生分享功能
		    if (navigator.share) {
		        navigator.share({
		            url: window.location.href
		        })
		       .then(() => console.log('网址分享成功'))
		       .catch((error) => console.log('网址分享失败：', error));
		    } else {
		        // 如果不支持原生分享，这里可以采用其他方式，比如复制网址到剪贴板
		        const textarea = document.createElement('textarea');
		        textarea.value = window.location.href;
		        document.body.appendChild(textarea);
		        textarea.select();
		        document.execCommand('copy');
		        document.body.removeChild(textarea);
		        console.log('已将网址复制到剪贴板，你可以手动分享');
		    }
		});