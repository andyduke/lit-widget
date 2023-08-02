
# Документация LitWidget

[ [ENGLISH](./DOCUMENTATION.md) | RUSSIAN ]

**LitWidget** - это паттерн для упрощения разработки Веб-компонентов с помощью библиотеки [Lit](https://lit.dev/).

Далее все Веб-компоненты на базе **LitWidget** будем называть виджетами.

**LitWidget** является расширением **LitElement** и позволяет [декларативно связать](#декларативная-привязка) свойства класса компонента с дочерними HTML-элементами, а так же добавить к ним обработчики событий. Такое связывание значительно упрощает работу с **[Light DOM](#light-dom)**. Этот паттерн похожим образом реализован в [Github/Catalyst](https://catalyst.rocks/) и [Stimulus.js](https://stimulus.hotwired.dev/).

Основная концепция **LitWidget** состоит в следующем: автор виджета описывает в классе привязку к элеменетам в Light DOM, а пользователь виджета размечает с помощью атрибута `data-target` конкретные точки привязки в Light DOM. Таким образом функциональность виджета не зависит от разметки и осуществляется разделение ответственности - представление находится в HTML, а логика в виджете.


## Пример использования

В следующем примере свойства `input` и `output` класса `HelloWidget` будут автоматически связаны с HTML-элементами внутри тэга компонента (Light DOM), которые помечены атрибутами `data-target="w-hello.input"` и `data-target="w-hello.output"` соответственно, а так же метод класса `greet()` будет добавлен в качестве обработчика события `click` кнопки, помеченной атрибутом `data-target="w-hello.button"`.

Класс виджета:
```js
import { LitWidget, target, onEvent } from '@simulacron/lit-widget';
import { customElement } from 'lit/decorators.js';

@customElement('w-hello')
class HelloWidget extends LitWidget {

  // Будет указывать на элемент с атрибутом data-target="w-button.input"
  @target input

  // Будет указывать на элемент с атрибутом data-target="w-button.output"
  @target output

  // Обработчик события click для элемента с атрибутом data-target="w-button.button"
  @onEvent('button', 'click')
  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```

HTML-разметка:
```html
<w-hello>
  <input data-target="w-hello.input" type="text" />

  <button data-target="w-hello.button">
    Greet
  </button>

  <span data-target="w-hello.output"></span>
</w-hello>
```

# Light DOM

Light DOM — это разметка, которую пишет пользователь вашего компонента. Этот DOM находится за пределами теневого DOM компонента - это настоящие дочерние элементы элемента.
```html
<w-details>
  <!-- the h4 and p are w-details's light DOM -->
  <h4>Shipping Details</h4>
  <p hidden>We ship worldwide.</p>
</w-details>
```

В **LitWidget** использование Light DOM включается путем установки свойства `lightDOM` в `true`:
```js
@customElement('w-sample')
class SampleWidget extends LitWidget {
  lightDOM = true
}
```
Такой виджет будет использовать себя в качестве `renderRoot` или дочерний элемент, помеченный атрибутом `data-root`, в качестве значения которого должно быть название тэга компонента:
```html
<w-sample>
  <p>Light <b>DOM</b></p>
  <div data-root="w-sample"></div>
</w-sample>
```


## Почему и когда стоит использовать Light DOM вместо Shadow DOM?

Shadow DOM имеет ряд ограничений, которые удобны при разработке веб-приложений, но не всегда подходят для разработки сайтов.

### Проблема с SEO

Shadow DOM ухудшает индексацию контента поисковыми системами, скрывая контент или разметку от индексирущих механизмов. Light DOM же позволяет работать с компонентами без ущерба для SEO.

Рассмотрим три подхода к реализации компонента заголовка.

1. Использование Shadow DOM, с передачей контента через атрибут компонента:
    ```js
    @customElement('shadow-dom')
    class ShadowDOMComponent extends LitElement {
      @property text;

      render() {
        return html`<h1>${this.text}</h1>`;
      }
    }
    ```
    ```html
    <shadow-dom text="Header text"></shadow-dom>
    ```

2. Использование Shadow DOM, с передачей контента через слот:
    ```js
    @customElement('shadow-dom-with-slot')
    class ShadowDOMwithSlotComponent extends LitElement {
      render() {
        return html`<h1><slot></slot></h1>`;
      }
    }
    ```
    ```html
    <shadow-dom-with-slot>
      Header text
    </shadow-dom-with-slot>
    ```

3. Использование Light DOM - контент как в обычном HTML-элементе:
    ```js
    @customElement('light-dom')
    class LightDOMComponent extends LitWidget {
      lightDOM = true
    }
    ```
    ```html
    <light-dom>
      <h1>Header text</h1>
    </light-dom>
    ```

Все три варианта в браузере выглядят одинаково, но индексирующие механизмы поисковых систем и других сервисов, по разному распознают контент в этих трех вариантах:
- некоторые (такие как Google) правильно определяют заголовок во всех трех вариантах;
- другие:
  - в первом варианте не видят контент вообще, т.к. он находится в Shadow DOM;
  - во втором варианте индексируется текст заголовка, но *не интерпретируется как заголовок*, т.к. тэг `<h1>` находится в Shadow DOM;
  - и только в третьем варианте индексируется заголовок тэга `<h1>` в Light DOM как и в обычном HTML.

Если для Вас важна поисковая оптимизация, то Вам необходимо использовать Light DOM для обеспечения доступности контента для индексации.

### Изоляция CSS-стилей

Shadow DOM изолирует не только стили компонента от общих стилей страницы, но и глобальные стили страницы от самого компонента.

Иногда это может создать дополнительные трудности, когда вы подключаете Веб-компоненты к уже работающему проекту, в котором у вас есть готовая дизайн система с описанием глобальных стилей.

Также использование одинаковых стилей внутри нескольких Веб-компонентов, например стилей для полей формы, приводит к увеличению кода и негативно сказывается на загрузке страницы.

**LitWidget** позволяет сделать [глобальные стили страницы доступными в Shadow DOM](#совместное-использование-стилей-css-в-shadow-dom)  Веб-компонента. Это поведение включено по умолчанию, при этом виджет будет отслеживать изменения в стилях страницы и при появлении нового тэга со стилями автоматически сделает его доступным и во всех виджетах со включенным совместныйм использованием глобальных стилей, так что если Вы подключаете какие-то API, например встраиваете карты, то их стили будут доступны в Shadow DOM виджетов.

### FUOC (мерцание нестилизованного контента)

Веб-компоненты (пользовательские элементы) определены в JavaScript-коде, включая их HTML и CSS. Они программно добавляются в DOM через API. К тому времени, когда браузер интерпретирует и выполнит этот код, есть большая вероятность, что конвейер рендеринга уже поместил пользовательский элемент на экран. Поскольку он не знает об элементе в первый раз, он отобразит его без предполагаемого стиля. После того, как JavaScript-код определения пользовательского элемента выполнен и браузер, следовательно, знает о правилах CSS, которые применяются к этому элементу, он может обновить представление.

Мерцание нестилизованного контента (FOUC) может вызывать раздражающие изменения макета, а также показывать контент, который должен был раскрываться постепенно.

FUOC возникает при использовании Shadow DOM в Веб-компонентах, но при использовании Light DOM такой проблемы нет, т.к. все содержимое Веб-компонента сразу известно браузеру и он может применить к нему глобальные стили страницы.


# Отличия от LitElement

**LitWidget**, в отличии от **LitElement**, по умолчанию воспроизводит (`render`) все вложенные элементы (Light DOM), таким образом достигается **[Прогрессивное Улучшение](https://en.wikipedia.org/wiki/Progressive_enhancement)**, когда HTML-страница содержит весь контент, который может быть проиндексирован поисковыми роботами, а не генерирует контент с помощью кода. Для изменения этого поведения достаточно переопределить метод `render` в виджете.

Так же, **LitWidget** делает все стили страницы доступными в **shadowRoot** по умолчанию, подробнее см. [Совместное использование стилей CSS](#совместное-использование-стилей-css-в-shadow-dom).


# Декларативная привязка

**LitWidget** позволяет в Light DOM (и в Shadow DOM тоже) указать элементы в качестве целей для привязки к свойствам и обработчикам класса.

Например, если в виджете указать привязку свойства `input` с помощью декоратора `@target`:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  @target input

}
```
...то это будет равносильно примерно вот такому геттеру:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  get input() {
    return this.querySelector(`data-target="${this.tagName}.input"`);
  }

}
```
Таким образом, далее в классе элемент из Light DOM с атрибутом `data-target="w-hello.input"` будет доступен так: `this.input`.


### Указание цели

Цели указываются с помощью атрибута `data-target`, в качестве значения атрибута необходимо указать имя тэга Веб-компонента и через точку имя цели, объявленной в виджете:
```html
<w-hello>
  <input type="text" data-target="w-hello.input" />
</w-hello>
```
> Префикс в качестве имени тэга необходим для избежания конфликтов, когда внутри Light DOM одного виджета, находится другой виджет, у которого может быть цель с таким же именем.

### Несколько целей

Если небоходимо указать несколько элементов в качестве массива целей, необходимо использовать атрибут `data-targets`, где в качестве значения указать имя тэга Веб-компонента и имя цели, как и в случае с одиночной целью `data-target`:
```html
<w-profile>
  <input type="text" name="home-email" data-targets="w-hello.emails" />
  <input type="text" name="work-email" data-targets="w-hello.emails" />
</w-profile>
```


## Привязка дочерних элементов к целям

Привязка целей в классе виджета осуществляется либо с помощью декораторов [`@target`](#target) и [`@targets`](#targets), либо через статические свойства [`targets`](#static-targets) и [`targetsAll`](#static-targetsall).

**Привязка с помощью декораторов:**
```js
@customElement('w-profile')
class ProfileWidget extends LitWidget {

  // В Light DOM/Shadow DOM будет доступна
  // точка привязки data-target="w-profile.name"
  @target name;

  // В Light DOM/Shadow DOM будут доступны
  // множественные точки привязки
  // data-targets="w-profile.emails"
  @targets({name: 'emails'}) emailList;

}
```

**Привязка с помощью статических свойств:**
```js
class ProfileWidget extends LitWidget {

  // В Light DOM/Shadow DOM будет доступна
  // точка привязки data-target="w-profile.name"
  // для свойства "this.name"
  static targets = {
    name: {}
  }

  // В Light DOM/Shadow DOM будут доступны
  // множественные точки привязки
  // data-targets="w-profile.emails"
  // для свойства "this.emailList"
  static targetsAll = {
    emails: {property: 'emailList'}
  }

}
customElements.define('w-profile', ProfileWidget);
```

### Синтаксис декораторов

#### `@target`

```js
@target[({ name?, selector?, cache = true, template = false })]
```

Свойство, к которому применяется декоратор, будет содержать ссылку на целевой HTML-элемент или `null`, если целевой элемент не найден.


##### name, selector

По умолчанию декоратор `@target` использует имя свойства в качестве имени цели:
```js
@target name;
```
...но вы можете передать в декоратор имя цели, отличное от имени свойства, например "profile-name":
```js
@target({name: 'profile-name'}) name;
```
...или CSS-селектор:
```js
@target({selector: '.profile-name'}) name;
```

##### cache

С помощью параметра `cache`, Вы можете управлять кэшированием операции поиска элементов. По умолчанию параметр `cache` установлен в `true`, поэтому при обращении к свойству производится поиск целевого элемента и результат поиска кэшируется. Если же Вы хотите при каждом обращении осуществлять поиск, необходимо установить парметр `cache` в `false`.

##### template

Параметр `template` позволяет указать, что в качестве целевого элемента используется тэг `<template>`. В этом случае свойство класса будет цказывать не на тэг, а на содержимое тэга `<template>` (см. [Lit#templateContent](https://lit.dev/docs/templates/directives/#templatecontent)).

#### `@targets`

```js
@targets[({ name?, selector?, cache = true })]
```

Свойство, к которому применяется данный декоратор будет всегда содержать массив элементов, в том числе - пустой массив, если ни одного целевого элемента не найдено.

Декоратор `@targets` принимает практически те же параметры, что и [`@target`](#target), кроме параметра `template`.


### Синтаксис статических свойств

#### static targets

Цели задаются в виде списка "ключ-значение", где в качестве ключа выступает имя цели, а в виде значения - объект с параметрами. Все параметры необязатальные, если ни один параметр не указан - то необходимо просто указать пустой объект `{}`.

```js
class HelloWidget extends LitWidget {

  static targets = {
    target_name: {
      property: String,
      selector: String,
      cache: Boolean = true,
      template: Boolean = false
    },
    target_name2: {},
    ...
  }

}
```

Параметр `property` позволяет задать имя свойства класса, которое будет связано с целевым элементом, если этот параметр не указан - используется имя цели.

В примере ниже объявляются две цели: элемент цели с именем "person" будет доступен в классе через свойство `this.person`, а элемент цели "avatar" будет доступен в классе через свойство `this.person_image`:
```js
class HelloWidget extends LitWidget {

  static targets = {
    avatar: {
      property: 'person_image'
    },
    person: {}
  }

}
```

В остальном параметры идентичны параметрам декоратора [`@target`](#target).


#### static targetsAll

Множественные цели задаются аналогично обычным (см. [static targets](#static-targets)):
```js
class HelloWidget extends LitWidget {

  static targetsAll = {
    target_name: {
      property: String,
      selector: String,
      cache: Boolean = true
    },
    ...
  }

}
```

Описание параметров см. в декораторе [`@targets`](#targets).


## Прослушивание событий

**LitWidget** автоматически добавляет специально отмеченные *публичные* методы класса в качестве обработчиков событий при подключении к DOM-элементу (в `connectedCallback`) и отключает их при отключении от DOM-элемента (в `disconnectedCallback`).

Обработчики событий добавляются к целевым элементам, указанным в DOM с помощью атрибутов `data-target` и `data-targets` (см. [Указание цели](#указание-цели)). Один обработчик может быть добавлен к нескольким элементам одновременно, а так же обрабатывать несколько событий одновременно.

Если указать метод класса как обработчик события цели:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  @onEvent('button', 'click')
  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```
...то если сильно упростить - это эквивалентно примерно такому коду:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  connectedCallback() {
    super.connectedCallback();

    this._greetBind = this.greet.bind(this);
    this.
      querySelector(`data-target="${this.tagName}.button"`).
      addEventListener('click', this._greetBind);
  }

  disconnectedCallback() {
    this.
      querySelector(`data-target="${this.tagName}.button"`).
      removeEventListener('click', this._greetBind);

    super.disconnectedCallback();
  }

  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```

> **LitWidget** отслеживает появление и исчезновение в Light DOM и Shadow DOM элементов с атрибутами целей (`data-target` и `data-targets`) и автоматически добавляет и убирает обработчики.

Указать метод класса как обработчик какого-то DOM-события можно двумя способами, с помощью декоратора [`@onEvent()`](#синтаксис-onevent) или свойства класса [`events`](#синтаксис-свойства-events).

**Указание обработчика события с помощью декоратора**:
```js
class LookupWidget extends LitWidget {

  @onEvent('input-field', 'input')
  typing(event) {
    ...
  }

}
```

**Указание обработчика события с помощью свойства `events`**:
```js
class LookupWidget extends LitWidget {

  events = [
    {target: 'input-field', event: 'input', handler: this.typing},
  ];

  typing(event) {
    ...
  }

}
```

### Синтаксис `@onEvent`

```js
onEvent(target, event, { [selector], [debounce], [throttle], [wrapper] })
```

#### target

Имя цели для добавления обработчика события к HTML-элементу в Light DOM с этим именем цели (см. [Указание цели](#указание-цели)).

Вы так же можете передать существующий HTML-элемент, объект `window` или `document`, чтобы добавить обработчик события, например, к `document.body` или `window`:
```js
class SampleWidget extends LitWidget {

  @onEvent(window, 'resize')
  windowSizeChanged(event) {
    ...
  }

}
```

#### event

Имя события DOM, к которому добавляется обработчик.

#### selector

Данный параметр позволяет фильтровать по CSS-селектору срабатывание делегированных событий.

> Использование делегирования событий может уменьшить количество используемых прослушивателей событий и, следовательно, повысить производительность.

Например вместо добавления обработчика события к каждому элементу списка, можно добавить обработчик события к самому списку, но отфильтровать по селектору элемента списка:
```js
@customElement('w-sample')
class SampleWidget extends LitWidget {

  @onEvent('list', 'click', { selector: '.list-item' })
  itemClick(event) {
    ...
  }

}
```
```html
<w-sample>
  ...
  <div data-target="w-sample.list">
    <div class="list-item">Item 1</div>
    <div class="list-item">Item 2</div>
    <div class="list-item">Item 3</div>
    <div class="list-separator"></div>
    <div class="list-item">Item 4</div>
  </div>
  ...
</w-sample>
```
В приведенном выше примере обработчик `itemClick(...)` сработает только при нажатии на пункты списка `<div class="list-item">...</div>`, но не на `<div class="list-separator"></div>`.


#### debounce, throttle

Опционально можно настроить частоту срабатывания обработчика события, с помощью параметров `debounce` или `throttle`.

> **Внимание!** Нельзя одновременно указать оба параметра.

* Debounce -
  откладывает вызов обработчика до того момента, когда с последнего вызова пройдёт определённое количество времени.
  *Это может быть удобно для таких событий, как нажатие клавиши или событие `input` в полях ввода.*

* Throttle -
  пропускает события с определённой периодичностью.
  *Это может быть удобно для событий `resize` или `scroll`.*

Вы можете указать значение в миллисекундах в виде числа или в строковом формате
с суффиксом `'<delay>ms'`, поддерживаемые суффиксы:
* ms - миллисекунды,
* s - секунды,
* m - минуты.

```js
class SampleWidget extends LitWidget {

  @onEvent(window, 'resize', { throttle: '500ms' })
  windowSizeChanged(event) {
    ...
  }

}
```

#### wrapper

Функция-обертка для применения дополнительных декораторов к обработчику событий; может быть полезно, например, для применения декоратора `debounce` с задержкой, установленной во время выполнения:
```js
@onEvent(..., wrapper: (fn, self) => debounce(fn, self.delay * 1000) )
```

Первый параметр, передаваемый в функцию — это метод обработчика события, второй является ссылкой на экземпляр класса.


### Синтаксис свойства `events`

Обработчики событий задаются в виде массива объектов с параметрами:
- target
- selector
- event
- handler
- debounce
- throttle
- wrapper

Параметры `target`, `event` и `handler` обязательные.

Параметр `handler` - должен указывать на метод класса или функцию - обработчик события.
> **Внимание!** Свойство `events` не статическое, потому в качестве обработчика *можно* указывать ссылку на метод класса.

В остальном параметры идентичны параметрам декоратора [`@onEvent`](#синтаксис-onevent).


```js
class HelloWidget extends LitWidget {

  events = [
    // Обработчик для целевого элемента
    {target: 'button', event: 'click', handler: this.buttonClick},

    // Делегированный обработчик события
    {target: 'list', selector: '.item', event: 'click', handler: this.listItemClick},

    // Обработчик события с ограниченной частотой срабатывания
    {target: 'search-field', event: 'input', handler: this.typing, debounce: '500ms'},

    // Обработчик события с условием
    {target: 'search-field', event: keydown(['Up', 'Down']), handler: this.navigate},

    // Обработчик события глобального элемента
    {target: document, event: 'click', handler: this.outsideClick},
  ]

}
```

### Условные события (Conditional events)

Условные события позволяет ограничить срабатывание обработчика события  определенными условиями, например только при нажатии определенных клавиш.

**LitWidget** позволяет вместо имени события указать объект состоящий из двух полей, `eventName` и `isMatch`:
```js
{
  eventName: 'keydown',
  isMatch: (event) => event.key == 'ArrowUp',
}
```

* **eventName** - название события;
* **isMatch** - функция, которая принимает в качестве параметра событие и возвращает булевое значение; если функция вернула `true`, то обработчик события сработает.

В приведенном ниже примере обработчик события `keydown` сработает только при нажатии на кнопку `Escape`:
```js
class SampleWidget extends LitWidget {

  @onEvent(
    'search-field',
    {
      eventName: 'keydown',
      isMatch: (event) => event.key == 'Escape',
    }
  )
  cancel(event) {
    ...
  }

}
```

Обработчики условий удобно организовывать в виде функций, пример выше можно записать так:
```js
function keydown(key) {
  return {
    eventName: 'keydown',
    isMatch: (event) => event.key == key,
  };
}

class SampleWidget extends LitWidget {

  @onEvent('search-field', keydown('Escape'))
  cancel(event) {
    ...
  }

}
```


# Значения по умолчанию

Часто Веб-компоненты создаются с целью их многократного использования в различных сценариях. Для этого в них добавляют возможность настройки, например через атрибуты.

В `LitElement` [атрибуты компонента связаны со свойствами класса](https://lit.dev/docs/components/properties/#attributes), для которых можно задать значения по умолчанию. Эти значения будут использоваться, если атрибут не указан в HTML-разметке компонента:
```js
@customElement('my-element')
class MyElement extends LitElement {

  @property({type: String})
  mode = 'expand';

  @property({type: String})
  expandedClass = 'expanded';

}
```
```html
<my-element mode="collapse"></my-element>
```


Вместо просто указания значений по умолчанию, в **LitWidget** можно вынести значения по умолчанию в отдельное статическое свойство `defaultValues` и использовать эти значения для инициализации свойств:
```js
class MyElement extends LitWidget {

  static defaultValues = {
    mode: 'expand',
    expandedClass: 'expanded',
  }

  @property({type: String})
  mode = this.defaultValues.mode;

  @property({type: String})
  expandedClass = this.defaultValues.expandedClass;

}
```

Такой подход позволяет сделать компоненты более настраиваемыми, появляется возможность настраивать значения по умолчанию глобально для всего компонента:
```js
MyElement.defaultValues.expandedClass = 'ui-expanded';
```

Это может быть удобным, если компоненты универсальные и необходимо иметь возможность настроить их поведение для конкретного проекта, но не хочется указывать одни и теже значения при каждом использовании компонентов.

> **Внимание!** Внутри компонента необходимо обращаться к `defaultValues` как в свойству класса, а не как к статическому свойству.

**LitWidget** автоматически создает геттер свойства класса, который объединяет все значения `defaultValues` из всей цепочки наследования класса:
```js
class MyElement extends LitWidget {

  static defaultValues = {
    mode: 'expand',
    expandedClass: 'expanded',
  }

}

class MyCustomElement extends MyElement {

  static defaultValues = {
    hint: 'Click to expand',
    expandedClass: 'custom-expanded',
  }

  connectedCallback() {
    console.log(this.defaultValues);
  }

}
```

Пример выше выведет в консоль:
```js
{ mode: "expand", expandedClass: "custom-expanded", hint: "Click to expand" }
```


# Совместное использование стилей CSS в Shadow DOM

**LitWidget** позволяет сделать глобальные стили страницы (`<style>` и `<link rel="stylesheet">`) доступными в Shadow DOM Веб-компонента.

Для этого необходимо установить свойство `sharedStyles` в `true`:
```js
class SampleWidget extends LitWidget {
  sharedStyles = true
}
```


**LitWidget**  будет отслеживать изменения в глобальных стилях страницы и при появлении нового тэга со стилями автоматически сделает его доступным и во всех виджетах со включенным `sharedStyles`, так что если Вы подключаете какие-то API, например встраиваете карты, то их стили будут доступны в Shadow DOM виджетов.

Если же такое поведение необходимо отключить, то надо установить свойство `sharedStyles` в `false`.

Если необходимо изолировать какие-то глобальные стили от Shadow DOM, то тэги `<style>` и `<link rel="stylesheet">`, их надо пометить атрибутом `data-shared="false"`:
```html
<style type="text/css">
  .component {
    background-color: teal;
  }
</style>
<style type="text/css" data-shared="false">
  /* Стили в этом тэге не будут доступны в Shadow DOM виджетов */
  .component {
    border: 1px solid red;
  }
</style>
```

По умолчанию, свойство `sharedStyles` установлено в `true`, *если не используется Light DOM*. При использовании Light DOM - занчение свойства игнорируется, т.к. глобальные стили всегда доступны в Light DOM.
