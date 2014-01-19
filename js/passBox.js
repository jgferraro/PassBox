(function($) {
	$.fn.mask = function(options) {
		var settings = $.extend({
			duration:		2000,		// Show plain-text character for 2 seconds by default
			maskCharacter:	'\u25CF'	// Bullet character
		}, options);

		// Set global timer variable
		var timer = null;
		
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
			var $passwordFiled = $textField.data('passwordField');
			var textValue = $textField.val();
			var regExpMask = new RegExp('[^' + settings.maskCharacter + ']', 'g'); // using RegExp for IE 7 compatibility

			if  (operation == null) {
				$textField.val(textValue.replace(regExpMask, settings.maskCharacter));
			}
		}
		
		function onKeyUp(e) {
			var $this = $(this);
			var operation = null;
			startTimer(function() {
				maskInput($this, operation);
			});
		}

		function onKeyDown(e) {
			stopTimer();
			maskInput(this);
		}
		
		function onChange(e) {
			stopTimer();
			maskInput(this);
		}
		
		function isValidCharacter(character) {
			// TODO: implement function
		}
		
		function getCursorPosition() {
			// TODO: implement function
		}

		function startTimer(func) {
			timer = setTimeout(func, settings.duration);
		}

		function stopTimer() {
			clearTimeout(timer);
		}
	}
}(jQuery));
