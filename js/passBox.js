(function($) {
	$.fn.mask = function(options) {
		var settings = $.extend({
			duration:		2000,		// Show plain-text character for 2 seconds by default
			maskCharacter:	'\u25CF'	// Bullet character
		}, options);

		// Set global timer variable
		var timer = null;
		var notValidCharacters = [8,13,16,17,18,20,33,34,35,36,38,40,45,91,93];

		this.each(function() { // Loop through all matching selectors 
			var $this = $(this);
			var $textField;

			// Set password and text fields
			// Text fields will hold a reference to their associated password element as a data attribute
			if ($this.prop('type') === 'password') {
				$textField = $('<input type="text" />').data('passwordField', $this);
				$this.after($textField).hide();
			}
			else if ($this.prop('type') === 'text') {
				$textField = $this;
				$passwordField = $this.clone().removeAttr('id').attr('type', 'password').hide();
				$textField.data('passwordField', $passwordField).removeAttr('name').after($passwordField);
			}
			else {
				return; // Input is not of the correct type; exit gracefully
			}
			
			// Add event listeners
			$textField.on('keyup', onKeyUp);
			$textField.on('keydown', onKeyDown);
			$textField.on('change', onChange);
		});
		
		/*
			params:
				target: The text input element to mask
				operation: The operation that was executed: add, remove, or null
		*/
		function maskInput(target, operation) {
			var $textField = $(target);
			var $passwordField = $textField.data('passwordField');
			var textValue = $textField.val();
			var regExpMask = new RegExp('[^' + settings.maskCharacter + ']', 'g'); // using RegExp for IE 7 compatibility
			var inputtedCharacter = textValue.match(regExpMask, settings.maskCharacter); // Get most recent character
			// Update password field
			if (!$passwordField.val()) {
				$passwordField.val(inputtedCharacter);
			} else {
				$passwordField.val($passwordField.val() + inputtedCharacter);
			}

			if (operation == null) { // Look into this with Jon
				$textField.val(textValue.replace(regExpMask, settings.maskCharacter)); // Mask un-hidden character
			}
		}
		
		function onKeyUp(e) {
			if (isValidCharacter(e.keyCode)) {
				var $this = $(this);
				var operation = null;
				getCursorPosition($this);
				startTimer(function() {
					maskInput($this, operation);
				});
			}
		}

		function onKeyDown(e) {
			if (isValidCharacter(e.keyCode)) {
				var $this = $(this);
				getCursorPosition($this);
				stopTimer();
				maskInput($this);
			}
		}
		
		function onChange(e) {
			stopTimer();
			maskInput(this);
		}
		
		function isValidCharacter(character) {
			// Check to see if input value warrants masking
			if ($.inArray(character, notValidCharacters) >= 0) {
				return false;
			} else {
				return true;
			}
		}
		
		function getCursorPosition(input) {
			// Borrowed from Maximilian Ruta (http://stackoverflow.com/questions/1891444/how-can-i-get-cursor-position-in-a-textarea)
			var element = input.get(0);
			var position = 0;
			if ('selectionStart' in element) {
				// IE9+ and good browsers 
				position = 'if' + element.selectionStart;
			} else if ('selection' in document) {
				// IE8 and lower
				element.focus();
				var Sel = document.selection.createRange();
				var SelLength = document.selection.createRange().text.length;
				Sel.moveStart('character', - element.value.length);
				position = Sel.text.length - SelLength;
			}
			return position;
		}

		function startTimer(func) {
			timer = setTimeout(func, settings.duration);
		}

		function stopTimer() {
			clearTimeout(timer);
		}
	}
}(jQuery));
