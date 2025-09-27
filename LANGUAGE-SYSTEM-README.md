# نظام إدارة اللغات | Language Management System

## نظرة عامة | Overview

تم تطوير نظام إدارة اللغات الجديد ليحل محل نظام JavaScript التقليدي ويستخدم ملف JSON لتخزين الترجمات. يدعم النظام اللغتين العربية والإنجليزية مع دعم كامل للتخطيط RTL (من اليمين إلى اليسار).

This new language management system replaces the traditional JavaScript approach and uses JSON files for storing translations. The system supports both Arabic and English with full RTL (Right-to-Left) layout support.

## الملفات الرئيسية | Main Files

### 1. ملف البيانات | Data File
- **`data/languages.json`** - ملف JSON يحتوي على جميع الترجمات للغتين العربية والإنجليزية

### 2. ملف JavaScript الرئيسي | Main JavaScript File
- **`js/language-manager.js`** - مدير اللغات الرئيسي مع جميع الوظائف

### 3. ملف CSS للدعم العربي | Arabic Support CSS
- **`css/rtl-support.css`** - أنماط CSS لدعم اللغة العربية والتخطيط RTL

### 4. صفحة الاختبار | Test Page
- **`language-test.html`** - صفحة اختبار شاملة لجميع ميزات النظام

## الميزات الرئيسية | Key Features

### 🌐 دعم متعدد اللغات | Multi-language Support
- **العربية (ar)**: دعم كامل للغة العربية مع التخطيط RTL
- **الإنجليزية (en)**: دعم اللغة الإنجليزية مع التخطيط LTR

### 📱 تصميم متجاوب | Responsive Design
- تخطيط متجاوب يعمل على جميع الأجهزة
- دعم الهواتف المحمولة والأجهزة اللوحية

### 🔄 تبديل فوري | Instant Switching
- تبديل فوري بين اللغات بدون إعادة تحميل الصفحة
- حفظ تلقائي للغة المختارة في localStorage

### 🎨 دعم CSS متقدم | Advanced CSS Support
- خطوط عربية محسنة (Cairo, Amiri)
- تخطيط RTL كامل لجميع العناصر
- تحسينات خاصة للنص العربي

### ⚡ أداء محسن | Optimized Performance
- تحميل تلقائي للترجمات
- نظام تخزين مؤقت ذكي
- مراقبة تلقائية للعناصر الجديدة في DOM

## هيكل ملف اللغات | Language File Structure

```json
{
  "en": {
    "meta": {
      "direction": "ltr",
      "language": "English",
      "code": "en"
    },
    "navigation": {
      "brand": "Food Security in Jordan",
      "nav_home": "Home",
      "nav_stats": "Statistics"
    },
    "hero": {
      "hero_title": "Food Security in Jordan",
      "hero_sub": "Ensuring sustainable agriculture..."
    }
  },
  "ar": {
    "meta": {
      "direction": "rtl",
      "language": "العربية",
      "code": "ar"
    },
    "navigation": {
      "brand": "الأمن الغذائي في الأردن",
      "nav_home": "الرئيسية",
      "nav_stats": "الإحصائيات"
    },
    "hero": {
      "hero_title": "الأمن الغذائي في الأردن",
      "hero_sub": "ضمان الزراعة المستدامة..."
    }
  }
}
```

## طريقة الاستخدام | Usage

### 1. إضافة الملفات المطلوبة | Include Required Files

```html
<!-- CSS Files -->
<link rel="stylesheet" href="css/style.css" />
<link rel="stylesheet" href="css/rtl-support.css" />

<!-- JavaScript Files -->
<script src="js/language-manager.js"></script>
```

### 2. إضافة خصائص الترجمة | Add Translation Attributes

```html
<!-- للنصوص العادية | For regular text -->
<h1 data-i18n="hero_title">Food Security in Jordan</h1>

<!-- للنصوص في المدخلات | For placeholder text -->
<input type="text" data-i18n-placeholder="search_placeholder">

<!-- للنصوص في العناوين | For title attributes -->
<button data-i18n-title="button_tooltip">Click me</button>
```

### 3. أزرار تبديل اللغة | Language Toggle Buttons

```html
<div class="lang-switch">
    <button id="lang-en" class="chip active">EN</button>
    <button id="lang-ar" class="chip">العربية</button>
</div>
```

### 4. استخدام JavaScript API | Using JavaScript API

```javascript
// تبديل إلى العربية | Switch to Arabic
languageManager.setLanguage('ar');

// تبديل إلى الإنجليزية | Switch to English
languageManager.setLanguage('en');

// الحصول على اللغة الحالية | Get current language
const currentLang = languageManager.getCurrentLanguage();

// الحصول على نص مترجم | Get translated text
const text = languageManager.getText('hero_title');

// إضافة مراقب لتغييرات اللغة | Add language change observer
languageManager.addObserver((langCode, langData) => {
    console.log('Language changed to:', langCode);
});
```

## الأقسام المترجمة | Translated Sections

### 🧭 التنقل | Navigation
- العلامة التجارية والقوائم
- أزرار التنقل الرئيسية
- البحث والإعدادات

### 🏠 الصفحة الرئيسية | Home Page
- العنوان الرئيسي والوصف
- أزرار الإجراءات
- الإحصائيات الأساسية

### 📊 الإحصائيات | Statistics
- عناوين الإحصائيات
- وصف البيانات
- تسميات الرسوم البيانية

### 💧 أنظمة الري | Irrigation Systems
- أنواع الري المختلفة
- مستويات الكفاءة
- الفوائد والخصائص

### 🌾 المحاصيل | Crops
- أنواع المحاصيل
- المناطق الزراعية
- بيانات الإنتاج

### 🌿 النباتات | Plants
- النباتات الأصلية
- النباتات الطبية
- الأنواع المهددة

### 🏢 الزراعة العمودية | Vertical Farming
- التقنيات الحديثة
- المشاريع والاستثمارات
- المقارنات والكفاءة

### 🦠 أمراض النباتات | Plant Diseases
- أنواع الأمراض
- استراتيجيات الإدارة
- التأثير الاقتصادي

### 📞 التواصل | Contact
- نماذج الاتصال
- معلومات المؤسسات
- الموارد والروابط

## ميزات CSS المتقدمة | Advanced CSS Features

### خطوط محسنة للعربية | Enhanced Arabic Fonts
```css
[dir="rtl"] {
    font-family: 'Cairo', 'Amiri', sans-serif;
    text-align: right;
}
```

### تخطيط RTL كامل | Full RTL Layout
```css
[dir="rtl"] .nav-menu {
    flex-direction: row-reverse;
}

[dir="rtl"] .hero-content {
    text-align: right;
}
```

### تحسينات للهواتف المحمولة | Mobile Optimizations
```css
@media (max-width: 768px) {
    [dir="rtl"] .nav-menu {
        text-align: right;
    }
}
```

## اختبار النظام | System Testing

### صفحة الاختبار | Test Page
افتح `language-test.html` لاختبار جميع ميزات النظام:

Open `language-test.html` to test all system features:

- تبديل اللغات الفوري | Instant language switching
- اختبار التخطيط RTL/LTR | RTL/LTR layout testing
- اختبار النماذج والمدخلات | Forms and inputs testing
- عرض معلومات النظام | System information display

### اختبارات وحدة التحكم | Console Tests
```javascript
// اختبار تبديل اللغات | Test language switching
testLanguageSystem.switchToArabic();
testLanguageSystem.switchToEnglish();

// اختبار الحصول على النصوص | Test text retrieval
testLanguageSystem.getText('hero_title');

// عرض اللغات المتاحة | Show available languages
testLanguageSystem.getAvailableLanguages();
```

## إضافة ترجمات جديدة | Adding New Translations

### 1. تحديث ملف JSON | Update JSON File
```json
{
  "en": {
    "new_section": {
      "new_key": "English text"
    }
  },
  "ar": {
    "new_section": {
      "new_key": "النص العربي"
    }
  }
}
```

### 2. إضافة العناصر في HTML | Add Elements in HTML
```html
<p data-i18n="new_key">Default text</p>
```

### 3. تحديث CSS إذا لزم الأمر | Update CSS if needed
```css
[dir="rtl"] .new-element {
    text-align: right;
}
```

## استكشاف الأخطاء | Troubleshooting

### مشاكل شائعة | Common Issues

#### 1. الترجمات لا تظهر | Translations not showing
- تأكد من تحميل `language-manager.js`
- تحقق من صحة ملف `languages.json`
- تأكد من وجود خاصية `data-i18n`

#### 2. التخطيط RTL لا يعمل | RTL layout not working
- تأكد من تحميل `rtl-support.css`
- تحقق من تطبيق `dir="rtl"` على العنصر الجذر

#### 3. الخطوط العربية لا تظهر | Arabic fonts not displaying
- تأكد من تحميل خطوط Google Fonts
- تحقق من تطبيق CSS الصحيح

### رسائل الخطأ | Error Messages
```javascript
// تفعيل وضع التشخيص | Enable debug mode
console.log('Language Manager Debug Info:', {
    isReady: languageManager.isReady(),
    currentLanguage: languageManager.getCurrentLanguage(),
    availableLanguages: languageManager.getAvailableLanguages()
});
```

## الأداء والتحسين | Performance & Optimization

### تحميل سريع | Fast Loading
- تحميل تلقائي للترجمات عند بدء التشغيل
- نظام تخزين مؤقت ذكي لتجنب إعادة التحميل

### ذاكرة محسنة | Optimized Memory
- تحميل اللغات حسب الحاجة
- تنظيف تلقائي للذاكرة

### شبكة محسنة | Network Optimized
- ملف JSON واحد لجميع اللغات
- ضغط تلقائي للبيانات

## التطوير المستقبلي | Future Development

### ميزات مخططة | Planned Features
- دعم لغات إضافية
- ترجمة تلقائية للمحتوى الديناميكي
- واجهة إدارة الترجمات
- تصدير/استيراد الترجمات

### تحسينات مقترحة | Suggested Improvements
- دعم التواريخ والأرقام المحلية
- ترجمة رسائل الخطأ
- دعم الترجمة الصوتية

## الدعم والمساعدة | Support & Help

للحصول على المساعدة أو الإبلاغ عن مشاكل:

For help or to report issues:

1. راجع صفحة الاختبار `language-test.html`
2. تحقق من وحدة التحكم للأخطاء
3. راجع هذا الدليل للحلول الشائعة

## 📊 إصلاح لوحة التحكم (Dashboard) - 27 سبتمبر 2025

### المشكلة:
- الرسوم البيانية في صفحة لوحة التحكم (`dashboard.html`) لا تعمل.
- الكود معقد وموزع بين ملفات متعددة (`dashboard.html`, `chart-manager.js`, `data-manager.js`).

### الإصلاحات المطبقة:

1.  **إنشاء ملف `js/dashboard.js`:**
    -   تم إنشاء ملف جديد لتجميع كل ما يتعلق بالرسوم البيانية في مكان واحد.

2.  **تبسيط `dashboard.html`:**
    -   تمت إزالة السكربت المباشر (inline script) من ملف HTML.
    -   تمت إزالة `onclick` من الأزرار.
    -   تم ربط الملف الجديد `js/dashboard.js`.

3.  **تنفيذ `js/dashboard.js`:**
    -   تمت إضافة مستمع أحداث للتأكد من تحميل الصفحة بالكامل قبل بدء تشغيل السكربت.
    -   يتم الآن جلب البيانات من `data/agricultural-statistics.json` باستخدام `fetch`.
    -   تم إنشاء مثالين للرسوم البيانية (شريطي ودائري).
    -   تمت إضافة الرسوم المتحركة والاستجابة للشاشات المختلفة.
    -   تمت إضافة تعليقات لشرح الكود.
    -   تمت إضافة معالجة الأخطاء في حالة فشل جلب البيانات.

4.  **حذف الملفات غير الضرورية:**
    -   تم حذف `js/chart-manager.js` و `js/data-manager.js` لعدم الحاجة إليهما في هذه الصفحة.

### النتائج:
- ✅ تعمل الرسوم البيانية الآن بشكل صحيح في صفحة لوحة التحكم.
- ✅ أصبح الكود أكثر تنظيماً وسهولة في الصيانة.
- ✅ تم تلبية جميع متطلبات المهمة.

---

**آخر تحديث | Last Updated**: ديسمبر 2024 | December 2024  
**الإصدار | Version**: 1.0  
**الترخيص | License**: MIT

**آخر تحديث | Last Updated**: ديسمبر 2024 | December 2024  
**الإصدار | Version**: 1.0  
**الترخيص | License**: MIT
