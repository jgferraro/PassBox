(function($) {
	$.fn.mask = function(options) {
		var settings = $.extend({
			duration: 		2000, 		// Show plain-text character for 2 seconds by default
			maskCharacter:  '\u25CF' 	// Bullet character
		}, options);
		
		this.each(function() { // loop through all matching selectors 
			var $this = $(this);
			var $textField;
			var $passwordField;
			
			// Set password and text fields
			if ($this.attr('type') === 'password') {
				$passwordField = $this;
				$textField = $('<input type="text" />');
			}
			else {
				$passwordField = $('<input type="password" />').attr('name', $this.attr('name'));
				$textField = $this.removeAttr('name');
			}
			
			// Add event listeners
			$textField.on('keyup', onKeyUp);
			$textField.on('change', onChange);
		});
		
		function maskInput() {
			// TODO: implement function
		}
		
		function onKeyUp(e) {
			// TODO: implement function
		}
		
		function onChange(e) {
			// TODO: implement function
		}
		
		function isValidCharacter(character) {
			// TODO: implement function
		}
		
		function getCursorPosition() {
			// TODO: implement function
		}
	}
}(jQuery));