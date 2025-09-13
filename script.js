// 游戏初始化与状态管理
document.addEventListener('DOMContentLoaded', () => {
    
    // 游戏状态对象
    const game = {
        state: {
            player: {
                name: "女帝",
                age: 16,
                reignYear: "开元元年",
                lifespan: "天命轮盘 (70-100)",
                health: 100,
                treasury: 50000,
                attributes: {
                    fengyi: 10,
                    quanshu: 10,
                    cailue: 10,
                    wupo: 10,
                    minxin: 50,
                    junli: 50
                },
                skills: {
                    chuangzi: 0,
                    duxin: 0,
                    tiaojiao: 0,
                }
            },
            time: {
                year: 1,
                month: 1,
                day: 1,
                shichen: "寅时"
            },
            location: "金銮殿",
            consorts: [],
            apiSettings: {
                url: '',
                key: '',
                model: ''
            }
        },

        // DOM元素引用
        elements: {
            treasury: document.getElementById('treasury'),
            location: document.getElementById('location'),
            gameTime: document.getElementById('game-time'),
            empressName: document.getElementById('empress-name'),
            empressAge: document.getElementById('empress-age'),
            reignYear: document.getElementById('reign-year'),
            empressLifespan: document.getElementById('empress-lifespan'),
            empressHealth: document.getElementById('empress-health'),
            attrFengyi: document.getElementById('attr-fengyi'),
            attrQuanshu: document.getElementById('attr-quanshu'),
            attrCailue: document.getElementById('attr-cailue'),
            attrWupo: document.getElementById('attr-wupo'),
            attrMinxin: document.getElementById('attr-minxin'),
            attrJunli: document.getElementById('attr-junli'),
            skillChuangzi: document.getElementById('skill-chuangzi'),
            skillDuxin: document.getElementById('skill-duxin'),
            skillTiaojiao: document.getElementById('skill-tiaojiao'),
            apiSettingsButton: document.getElementById('api-settings-button'),
            modal: document.getElementById('api-modal'),
            closeApiButton: document.getElementById('close-api-button'),
            saveApiButton: document.getElementById('save-api-button'),
            testApiButton: document.getElementById('test-api-button'),
            apiUrlInput: document.getElementById('api-url'),
            apiKeyInput: document.getElementById('api-key'),
            apiModelInput: document.getElementById('api-model'),
            apiStatus: document.getElementById('api-status'),
        },

        // 初始化函数
        init() {
            this.loadApiSettings();
            this.bindEvents();
            this.updateUI();
            console.log("女帝模拟器初始化完成。");
        },

        // 绑定所有事件监听器
        bindEvents() {
            this.elements.apiSettingsButton.addEventListener('click', () => this.showApiModal());
            this.elements.closeApiButton.addEventListener('click', () => this.hideApiModal());
            this.elements.saveApiButton.addEventListener('click', () => this.saveApiSettings());
            this.elements.testApiButton.addEventListener('click', () => this.testApiConnection());
        },
        
        // 更新整个UI界面
        updateUI() {
            const player = this.state.player;
            this.elements.treasury.textContent = player.treasury;
            this.elements.location.textContent = this.state.location;
            this.elements.gameTime.textContent = `${player.reignYear} ${this.state.time.month}月 ${this.state.time.shichen}`;
            
            this.elements.empressName.textContent = player.name;
            // ... 后续可添加更多UI更新逻辑
        },

        // --- API 设置相关功能 ---

        showApiModal() {
            this.elements.modal.style.display = 'flex';
        },

        hideApiModal() {
            this.elements.modal.style.display = 'none';
        },

        // 从localStorage加载API设置
        loadApiSettings() {
            const settings = localStorage.getItem('empressApiSettings');
            if (settings) {
                this.state.apiSettings = JSON.parse(settings);
                this.elements.apiUrlInput.value = this.state.apiSettings.url || '';
                this.elements.apiKeyInput.value = this.state.apiSettings.key || '';
                this.elements.apiModelInput.value = this.state.apiSettings.model || '';
            }
        },

        // 保存API设置到状态和localStorage
        saveApiSettings() {
            this.state.apiSettings.url = this.elements.apiUrlInput.value.trim();
            this.state.apiSettings.key = this.elements.apiKeyInput.value.trim();
            this.state.apiSettings.model = this.elements.apiModelInput.value.trim();
            
            localStorage.setItem('empressApiSettings', JSON.stringify(this.state.apiSettings));
            
            this.elements.apiStatus.textContent = '设置已保存！';
            this.elements.apiStatus.className = 'api-status-message success';
            setTimeout(() => this.elements.apiStatus.textContent = '', 2000);
            this.hideApiModal();
        },

        // 测试API连接
        async testApiConnection() {
            const url = this.elements.apiUrlInput.value.trim();
            const key = this.elements.apiKeyInput.value.trim();
            const model = this.elements.apiModelInput.value.trim();

            if (!url || !key || !model) {
                this.elements.apiStatus.textContent = '错误：请填写所有字段。';
                this.elements.apiStatus.className = 'api-status-message error';
                return;
            }

            this.elements.apiStatus.textContent = '正在测试连接...';
            this.elements.apiStatus.className = 'api-status-message';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: 'user', content: '你好' }],
                        max_tokens: 5,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    this.elements.apiStatus.textContent = '连接成功！';
                    this.elements.apiStatus.className = 'api-status-message success';
                } else {
                    const errorData = await response.json();
                    this.elements.apiStatus.textContent = `连接失败: ${response.status} - ${errorData.error.message}`;
                    this.elements.apiStatus.className = 'api-status-message error';
                }
            } catch (error) {
                this.elements.apiStatus.textContent = `连接错误: ${error.message}`;
                this.elements.apiStatus.className = 'api-status-message error';
            }
        }
    };

    // 启动游戏
    game.init();
});