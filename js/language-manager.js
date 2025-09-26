/**
 * Language Manager - إدارة اللغات باستخدام ملف JSON
 * يدعم العربية والإنجليزية مع تبديل الاتجاه التلقائي
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'ar'; // تعيين العربية كلغة افتراضية
        this.languages = {};
        this.isLoaded = false;
        this.observers = [];
        this.init();
    }

    /**
     * تهيئة مدير اللغات
     */
    async init() {
        try {
            await this.loadLanguages();
            this.setupEventListeners();
            this.setLanguage(this.getStoredLanguage() || 'ar');
            this.isLoaded = true;
            console.log('Language Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Language Manager:', error);
            this.isLoaded = false;
        }
    }

    /**
     * تحميل ملف اللغات من JSON
     */
    async loadLanguages() {
        try {
            // محاولة تحميل الملف من مسارات مختلفة
            let response;
            const possiblePaths = [
                'data/languages.json',      // للصفحة الرئيسية
                '../data/languages.json'    // للصفحات في مجلد html
            ];
            
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Could not load languages from any path`);
            }
            
            this.languages = await response.json();
            console.log('Languages loaded:', Object.keys(this.languages));
        } catch (error) {
            console.error('Error loading languages:', error);
            // استخدام بيانات احتياطية بسيطة
            this.languages = {
                en: {
                    meta: { direction: 'ltr', language: 'English', code: 'en' },
                    navigation: { brand: 'Food Security in Jordan' },
                    common: { loading: 'Loading...' }
                },
                ar: {
                    meta: { direction: 'rtl', language: 'العربية', code: 'ar' },
                    navigation: { brand: 'الأمن الغذائي في الأردن' },
                    common: { loading: 'جاري التحميل...' }
                }
            };
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // أزرار تبديل اللغة
        const enBtn = document.getElementById('lang-en');
        const arBtn = document.getElementById('lang-ar');

        if (enBtn) {
            enBtn.addEventListener('click', () => this.setLanguage('en'));
        }
        if (arBtn) {
            arBtn.addEventListener('click', () => this.setLanguage('ar'));
        }

        // مراقبة تغييرات DOM للعناصر الجديدة
        this.observeNewElements();
    }

    /**
     * تعيين اللغة الحالية
     * @param {string} langCode - رمز اللغة (en/ar)
     */
    setLanguage(langCode) {
        if (!this.languages[langCode]) {
            console.warn(`Language ${langCode} not found, defaulting to English`);
            langCode = 'en';
        }

        this.currentLanguage = langCode;
        const langData = this.languages[langCode];

        // تحديث اتجاه الصفحة
        this.updatePageDirection(langData.meta.direction);

        // تحديث جميع النصوص
        this.updateAllTexts();

        // تحديث أزرار اللغة
        this.updateLanguageButtons();

        // حفظ اللغة المختارة
        this.storeLanguage(langCode);

        // إشعار المراقبين
        this.notifyObservers(langCode, langData);

        console.log(`Language changed to: ${langData.meta.language}`);
    }

    /**
     * تحديث اتجاه الصفحة
     * @param {string} direction - ltr أو rtl
     */
    updatePageDirection(direction) {
        document.documentElement.dir = direction;
        document.documentElement.lang = this.currentLanguage;
        
        // تحديث فئات CSS للاتجاه
        document.body.classList.toggle('rtl', direction === 'rtl');
        document.body.classList.toggle('ltr', direction === 'ltr');
    }

    /**
     * تحديث جميع النصوص في الصفحة
     */
    updateAllTexts() {
        if (!this.isLoaded) {
            console.warn('Language Manager not loaded yet, skipping text update');
            return;
        }

        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`Updating ${elements.length} elements with data-i18n`);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getText(key);
            if (text && text !== key) {
                element.textContent = text;
                console.log(`Updated element with key "${key}" to: "${text}"`);
            } else {
                console.warn(`Failed to translate key: ${key}, keeping original content`);
                // إذا فشلت الترجمة، احتفظ بالنص الأصلي إن وجد
                if (!element.textContent || element.textContent.trim() === key) {
                    element.textContent = key; // استخدم المفتاح كنص احتياطي
                }
            }
        });

        // تحديث النصوص في placeholder
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const text = this.getText(key);
            if (text && text !== key) {
                element.placeholder = text;
            }
        });

        // تحديث النصوص في title
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const text = this.getText(key);
            if (text && text !== key) {
                element.title = text;
            }
        });
    }

    /**
     * الحصول على نص مترجم
     * @param {string} key - مفتاح الترجمة
     * @returns {string} النص المترجم
     */
    getText(key) {
        const langData = this.languages[this.currentLanguage];
        if (!langData) {
            console.warn(`Language data not found for: ${this.currentLanguage}`);
            return key;
        }

        // البحث في الأقسام المختلفة
        const sections = [
            'navigation', 'hero', 'statistics', 'irrigation', 'crops', 
            'plants', 'vertical_farming', 'diseases', 'contact', 'footer', 'common'
        ];

        // البحث في كل قسم
        for (const section of sections) {
            if (langData[section] && langData[section][key]) {
                return langData[section][key];
            }
        }

        // البحث المباشر في الجذر (fallback)
        if (langData[key]) {
            return langData[key];
        }

        // البحث العميق في جميع الأقسام
        for (const section of Object.keys(langData)) {
            if (typeof langData[section] === 'object' && langData[section][key]) {
                return langData[section][key];
            }
        }

        // إذا لم يتم العثور على الترجمة، إرجاع المفتاح
        console.warn(`Translation not found for key: ${key} in language: ${this.currentLanguage}`);
        return key;
    }

    /**
     * تحديث أزرار اللغة
     */
    updateLanguageButtons() {
        const enBtn = document.getElementById('lang-en');
        const arBtn = document.getElementById('lang-ar');

        if (enBtn && arBtn) {
            enBtn.classList.toggle('active', this.currentLanguage === 'en');
            arBtn.classList.toggle('active', this.currentLanguage === 'ar');
        }
    }

    /**
     * حفظ اللغة المختارة في localStorage
     * @param {string} langCode - رمز اللغة
     */
    storeLanguage(langCode) {
        try {
            localStorage.setItem('selectedLanguage', langCode);
        } catch (error) {
            console.warn('Could not store language preference:', error);
        }
    }

    /**
     * استرجاع اللغة المحفوظة من localStorage
     * @returns {string|null} رمز اللغة المحفوظة
     */
    getStoredLanguage() {
        try {
            return localStorage.getItem('selectedLanguage');
        } catch (error) {
            console.warn('Could not retrieve language preference:', error);
            return null;
        }
    }

    /**
     * الحصول على اللغة الحالية
     * @returns {string} رمز اللغة الحالية
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * الحصول على بيانات اللغة الحالية
     * @returns {Object} بيانات اللغة
     */
    getCurrentLanguageData() {
        return this.languages[this.currentLanguage];
    }

    /**
     * الحصول على جميع اللغات المتاحة
     * @returns {Array} قائمة اللغات المتاحة
     */
    getAvailableLanguages() {
        return Object.keys(this.languages).map(code => ({
            code,
            name: this.languages[code].meta.language,
            direction: this.languages[code].meta.direction
        }));
    }

    /**
     * إضافة مراقب لتغييرات اللغة
     * @param {Function} callback - دالة الاستدعاء
     */
    addObserver(callback) {
        this.observers.push(callback);
    }

    /**
     * إزالة مراقب
     * @param {Function} callback - دالة الاستدعاء المراد إزالتها
     */
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * إشعار جميع المراقبين بتغيير اللغة
     * @param {string} langCode - رمز اللغة الجديدة
     * @param {Object} langData - بيانات اللغة
     */
    notifyObservers(langCode, langData) {
        this.observers.forEach(callback => {
            try {
                callback(langCode, langData);
            } catch (error) {
                console.error('Error in language observer:', error);
            }
        });
    }

    /**
     * مراقبة العناصر الجديدة في DOM
     */
    observeNewElements() {
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // فحص إذا كان العنصر الجديد يحتوي على data-i18n
                            if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                                shouldUpdate = true;
                            }
                            
                            // فحص العناصر الفرعية
                            const i18nElements = node.querySelectorAll ? 
                                node.querySelectorAll('[data-i18n]') : [];
                            
                            if (i18nElements.length > 0) {
                                shouldUpdate = true;
                                i18nElements.forEach(element => {
                                    const key = element.getAttribute('data-i18n');
                                    const text = this.getText(key);
                                    if (text && text !== key) {
                                        element.textContent = text;
                                        console.log(`Auto-updated new element with key "${key}"`);
                                    }
                                });
                            }
                        }
                    });
                });
                
                // إذا تم إضافة عناصر جديدة، قم بتحديث شامل بعد فترة قصيرة
                if (shouldUpdate && this.isLoaded) {
                    setTimeout(() => {
                        this.updateAllTexts();
                    }, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('DOM mutation observer initialized');
        }
    }

    /**
     * تحديث ترجمات محددة
     * @param {Object} translations - ترجمات جديدة
     * @param {string} langCode - رمز اللغة
     */
    updateTranslations(translations, langCode = this.currentLanguage) {
        if (!this.languages[langCode]) {
            this.languages[langCode] = { meta: { code: langCode } };
        }

        // دمج الترجمات الجديدة
        Object.keys(translations).forEach(section => {
            if (!this.languages[langCode][section]) {
                this.languages[langCode][section] = {};
            }
            Object.assign(this.languages[langCode][section], translations[section]);
        });

        // تحديث النصوص إذا كانت اللغة الحالية
        if (langCode === this.currentLanguage) {
            this.updateAllTexts();
        }
    }

    /**
     * تصدير الترجمات الحالية
     * @param {string} langCode - رمز اللغة (اختياري)
     * @returns {Object} بيانات الترجمة
     */
    exportTranslations(langCode = this.currentLanguage) {
        return JSON.parse(JSON.stringify(this.languages[langCode] || {}));
    }

    /**
     * تحديد ما إذا كان مدير اللغات جاهزاً
     * @returns {boolean} حالة الجاهزية
     */
    isReady() {
        return this.isLoaded;
    }

    /**
     * انتظار حتى يصبح مدير اللغات جاهزاً
     * @returns {Promise} وعد يتم حله عند الجاهزية
     */
    async waitUntilReady() {
        while (!this.isLoaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return true;
    }

    /**
     * فحص وإصلاح العناصر التي تظهر data-i18n بدلاً من النص
     */
    fixBrokenTranslations() {
        if (!this.isLoaded) {
            console.warn('Language Manager not loaded, cannot fix translations');
            return;
        }

        const elements = document.querySelectorAll('[data-i18n]');
        let fixedCount = 0;

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const currentText = element.textContent.trim();
            
            // إذا كان النص الحالي هو نفس المفتاح، فهذا يعني أن الترجمة فشلت
            if (currentText === key || currentText === '' || currentText.startsWith('data-i18n')) {
                const translatedText = this.getText(key);
                if (translatedText && translatedText !== key) {
                    element.textContent = translatedText;
                    fixedCount++;
                    console.log(`Fixed broken translation for key: ${key}`);
                }
            }
        });

        console.log(`Fixed ${fixedCount} broken translations`);
        return fixedCount;
    }
}

// تصدير للاستخدام كوحدة
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}

// إنشاء instance عام من LanguageManager
window.languageManager = new LanguageManager();

// تهيئة تلقائية عند تحميل DOM
document.addEventListener('DOMContentLoaded', async () => {
    if (window.languageManager) {
        console.log('DOM loaded, initializing language manager...');
        
        // انتظار حتى يتم تحميل النظام مع timeout أطول
        let attempts = 0;
        while (!window.languageManager.isLoaded && attempts < 100) {
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
        
        if (window.languageManager.isLoaded) {
            console.log('Language Manager loaded successfully');
            
            // تحديث فوري للنصوص
            window.languageManager.updateAllTexts();
            
            // تحديث إضافي بعد فترة قصيرة للتأكد
            setTimeout(() => {
                window.languageManager.updateAllTexts();
                window.languageManager.fixBrokenTranslations();
                console.log('Secondary text update completed');
            }, 200);
            
            // تحديث نهائي بعد فترة أطول مع إصلاح الترجمات المكسورة
            setTimeout(() => {
                window.languageManager.updateAllTexts();
                window.languageManager.fixBrokenTranslations();
                console.log('Final text update completed');
            }, 1000);
            
            // فحص دوري للترجمات المكسورة
            setInterval(() => {
                if (window.languageManager.isLoaded) {
                    window.languageManager.fixBrokenTranslations();
                }
            }, 5000);
        } else {
            console.error('Language Manager failed to load within timeout');
            // محاولة أخيرة لتحديث النصوص حتى لو لم يكتمل التحميل
            setTimeout(() => {
                if (window.languageManager) {
                    window.languageManager.updateAllTexts();
                }
            }, 2000);
        }
    }
});

// دالة عامة لإصلاح الترجمات يمكن استدعاؤها من وحدة التحكم
window.fixTranslations = function() {
    if (window.languageManager && window.languageManager.isLoaded) {
        console.log('Manually fixing translations...');
        window.languageManager.updateAllTexts();
        const fixed = window.languageManager.fixBrokenTranslations();
        console.log(`Manual fix completed. Fixed ${fixed} elements.`);
        return fixed;
    } else {
        console.error('Language Manager not available or not loaded');
        return 0;
    }
};

// دالة للتحقق من حالة الترجمة
window.checkTranslationStatus = function() {
    if (!window.languageManager) {
        console.error('Language Manager not available');
        return;
    }
    
    const elements = document.querySelectorAll('[data-i18n]');
    let brokenCount = 0;
    let workingCount = 0;
    let missingKeys = [];
    
    console.log(`=== Translation Status Check ===`);
    console.log(`Total elements with data-i18n: ${elements.length}`);
    console.log(`Current language: ${window.languageManager.currentLanguage}`);
    console.log(`Language Manager loaded: ${window.languageManager.isLoaded}`);
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const currentText = element.textContent.trim();
        const translation = window.languageManager.getTranslation(key);
        
        if (!translation || translation === key || currentText === key) {
            brokenCount++;
            missingKeys.push(key);
            console.warn(`❌ Missing/broken translation for: "${key}" (current text: "${currentText}")`);
        } else {
            workingCount++;
        }
    });
    
    console.log(`✅ Working translations: ${workingCount}`);
    console.log(`❌ Broken translations: ${brokenCount}`);
    
    if (missingKeys.length > 0) {
        console.log(`Missing keys:`, missingKeys);
    }
    
    return {
        total: elements.length,
        working: workingCount,
        broken: brokenCount,
        missingKeys: missingKeys
    };
};

// دالة لإضافة الترجمات المفقودة تلقائياً
window.addMissingTranslations = function() {
    if (!window.languageManager || !window.languageManager.isLoaded) {
        console.error('Language Manager not available or not loaded');
        return;
    }
    
    const status = window.checkTranslationStatus();
    if (status.missingKeys.length === 0) {
        console.log('✅ No missing translations found!');
        return;
    }
    
    console.log(`🔧 Adding ${status.missingKeys.length} missing translations...`);
    
    // قائمة الترجمات الاحتياطية
    const fallbackTranslations = {
        en: {
            // إضافة ترجمات احتياطية شائعة
            'loading': 'Loading...',
            'error': 'Error',
            'success': 'Success',
            'cancel': 'Cancel',
            'confirm': 'Confirm',
            'close': 'Close',
            'save': 'Save',
            'edit': 'Edit',
            'delete': 'Delete',
            'add': 'Add',
            'search': 'Search',
            'filter': 'Filter',
            'sort': 'Sort',
            'export': 'Export',
            'import': 'Import',
            'download': 'Download',
            'upload': 'Upload',
            'refresh': 'Refresh',
            'reset': 'Reset',
            'submit': 'Submit',
            'back': 'Back',
            'next': 'Next',
            'previous': 'Previous',
            'home': 'Home',
            'about': 'About',
            'contact': 'Contact',
            'help': 'Help',
            'settings': 'Settings'
        },
        ar: {
            'loading': 'جاري التحميل...',
            'error': 'خطأ',
            'success': 'نجح',
            'cancel': 'إلغاء',
            'confirm': 'تأكيد',
            'close': 'إغلاق',
            'save': 'حفظ',
            'edit': 'تحرير',
            'delete': 'حذف',
            'add': 'إضافة',
            'search': 'بحث',
            'filter': 'تصفية',
            'sort': 'ترتيب',
            'export': 'تصدير',
            'import': 'استيراد',
            'download': 'تحميل',
            'upload': 'رفع',
            'refresh': 'تحديث',
            'reset': 'إعادة تعيين',
            'submit': 'إرسال',
            'back': 'رجوع',
            'next': 'التالي',
            'previous': 'السابق',
            'home': 'الرئيسية',
            'about': 'حول',
            'contact': 'اتصل',
            'help': 'مساعدة',
            'settings': 'الإعدادات'
        }
    };
    
    let addedCount = 0;
    status.missingKeys.forEach(key => {
        // محاولة إضافة الترجمة من القائمة الاحتياطية
        if (fallbackTranslations.en[key] && fallbackTranslations.ar[key]) {
            // إضافة الترجمة للذاكرة المؤقتة
            if (!window.languageManager.languages.en.common) {
                window.languageManager.languages.en.common = {};
            }
            if (!window.languageManager.languages.ar.common) {
                window.languageManager.languages.ar.common = {};
            }
            
            window.languageManager.languages.en.common[key] = fallbackTranslations.en[key];
            window.languageManager.languages.ar.common[key] = fallbackTranslations.ar[key];
            
            addedCount++;
            console.log(`✅ Added translation for: ${key}`);
        } else {
            console.warn(`⚠️ No fallback translation for: ${key}`);
        }
    });
    
    if (addedCount > 0) {
        // إعادة تحديث النصوص
        window.languageManager.updateAllTexts();
        console.log(`🎉 Successfully added ${addedCount} translations!`);
    }
    
    return addedCount;
};
