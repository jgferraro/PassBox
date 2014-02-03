(function($) {
	$.fn.mask = function(options) {
		var settings = $.extend({
			duration:		2000,		// Show plain-text character for 2 seconds by default
			maskCharacter:	'\u25CF'	// Bullet character
		}, options);

		// Set global timer variable
		var timer = null;

		$(this).each(function() { // Loop through all matching selectors 
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
				operation: The operation that was executed: add, remove, timeout, or null
		*/
		function maskInput(target, operation, cursorPosition) {
			var $textField = $(target);
			var $passwordField = $textField.data('passwordField');
			var textValue = $textField.val();
			var regExpMask = new RegExp('[^' + settings.maskCharacter + ']', 'g'); // using RegExp for IE 7 compatibility
			var inputtedCharacter = textValue.match(regExpMask, settings.maskCharacter); // Get most un-hidden character

			if ((operation === 'add') && (inputtedCharacter !== null)) {
				// Update password field
				if (!$passwordField.val()) {
					$passwordField.val(inputtedCharacter);
				} else {
					var currentPassword = $passwordField.val();
					var passwordArray = currentPassword.split('');
					passwordArray.splice(cursorPosition - 1, 0, inputtedCharacter);
					$passwordField.val(passwordArray.join(''));
				}
				$textField.val(textValue.replace(inputtedCharacter[0], settings.maskCharacter)); // Mask un-hidden character
			} else if (operation === 'remove') {

			} else {
				$textField.val(textValue.replace(regExpMask, settings.maskCharacter));
			}
		}
		
		function onKeyUp(e) {
			if (isValidCharacter(e.keyCode)) {
				var $this = $(this);
				var cPosition = getCursorPosition($this);
				var backspace = 8;
				var operation;

				if (e.keyCode === backspace) {
					operation = 'remove';
				} else {
					operation = 'add';
				}

				startTimer(function() {
					operation = 'add';
					maskInput($this, operation, cPosition);
					$this.caretTo(cPosition); // Move caret back to where it was
				});
			}
		}

		function onKeyDown(e) {
			if (isValidCharacter(e.keyCode)) {
				var $this = $(this);
				var cPosition = getCursorPosition($this);
				operation = 'add';
				
				stopTimer();
				maskInput($this, operation, cPosition);
				$this.caretTo(cPosition); // Move caret back to where it was
			}
		}
		
		function onChange() {
			var $this = $(this);
			var cPosition = getCursorPosition($this);
			operation = 'add';
			stopTimer();
			maskInput($this, operation, cPosition);
		}
		
		function isValidCharacter(character) {
			var notValidCharacters = [9,13,16,17,18,20,33,34,35,36,37,38,39,40,45,91,93];
			// Check to see if input value warrants masking
			if ($.inArray(character, notValidCharacters) >= 0) {
				// Not Valid Character
				return false;
			} else {
				// Valid Character
				return true;
			}
		}
		
		function getCursorPosition(input) {
			// Borrowed from Maximilian Ruta (http://stackoverflow.com/questions/1891444/how-can-i-get-cursor-position-in-a-textarea)
			var element = input.get(0);
			var position = 0;
			if ('selectionStart' in element) {
				// IE9+ and good browsers 
				position = element.selectionStart;
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

		// Caret positioning written by DrPheltRight (https://gist.github.com/DrPheltRight/1007907)
		$.fn.caretTo = function (index, offset) {
			return this.queue(function (next) {
				if (isNaN(index)) {
					var i = $(this).val().indexOf(index);
					if (offset === true) {
						i += index.length;
					} else if (offset) {
						i += offset;
					}
					$.caretTo(this, i);
				} else {
					$.caretTo(this, index);
				}
				next();
			});
		};

		$.caretTo = function (el, index) {
			if (el.createTextRange) { 
				var range = el.createTextRange();
				range.move("character", index);
				range.select(); 
			} else if (el.selectionStart != null) {
				el.focus(); 
				el.setSelectionRange(index, index);
			}
		};
	}
}(jQuery));