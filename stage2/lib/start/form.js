var Start = Start || {};

Start.showForm = function () {
	var save = function () {
		$.cookie('resolution',   $form.find('[name=resolution]').val());
		$.cookie('quality',      $form.find('[name=quality]'   ).val());
		$.cookie('engine',       $form.find('[name=engine]'    ).val());
		$.cookie('texture',    !!$form.find('[name=texture]'   ).val());
		$.cookie('light',      !!$form.find('[name=light]'     ).val());
	};
	var $form = $('div.form');
	$form.find('div').hide();
	$form.find('[name=run-game]').click(function () {
		save();
		moveTo({
			type : 'game'
		});
	});
	$form.find('[name=run-editor]').click(function () {
		moveTo({
			type : 'editor',
			w : $form.find('[name=w]'    ).val(),
			h : $form.find('[name=h]'    ).val()
		});
	});
	$form.find('select, input').change(save);
	var showType = function () {
		if ($(this).val() == 'editor') {
			$form.children(".editor-params").slideDown();
			$form.children(".game-params").slideUp();
			$form.find(".game-params .params").slideUp();
		} else {
			$form.children(".editor-params").slideUp();
			$form.children(".game-params").slideDown();
		}
	};
	$form.find("[name=type]").change(showType).change();
}