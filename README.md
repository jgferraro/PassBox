PassBox
=======

```html
<input id="password" type="password" />
OR
<input id="text" type="text" />
```

```javascript
// PassBox works with text or password type inputs, you can also pass in multiple inputs at once
$('#password').mask();
$('input[type=password]').mask();

$('#text').mask();
$('input[type=text]').mask();
```