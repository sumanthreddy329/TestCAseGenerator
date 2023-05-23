function generateTestCases() {
  var selectedValue = $('#dropdown').val();

  if (selectedValue === 'longIdRet') {
    generateTestCasesForLongIdRet();
  } else if (selectedValue === 'classObjRet') {
    generateTestCasesForClassObjRet();
  }
}

function generateTestCasesForLongIdRet() {
  var methodName = $('#methodName').val();
  var classValues = $('#classValues').val();
  var controllerName = $('#controllerName').val();
  var returnValue = $('#returnValue').val();

  // Check if all required fields are filled
	if (!methodName) {
		alert('Please fill in all the required fields.');
	return;
  }

  // Split the class values and generate statements for each value
  var classValuesArray = classValues.split(',');
  var statements = [];
  for (var i = 0; i < classValuesArray.length; i++) {
    var classValue = classValuesArray[i].trim();
    statements.push('Long.parseLong("' + classValue + '")');
  }

  // Generate the test cases
  var testCase = `
@Test
public void ${methodName}_works() {
  Person person = super.createTnlAdmin();
  super.createPersonExpectations(person);
  ModelAndView mvRet = new ModelAndView();
  ${controllerName} controller = createController();
  when(sessionService.getSessionPerson()).thenReturn(person);
  final TestHtmlHelper html = new TestHtmlHelper();
  PdsHelper h = mock(PdsHelper.class);
  html.setPdsHelper_TESTONLY(h);
  when(${returnValue}).thenReturn(mvRet);
  ModelAndView mv = controller.${methodName}(${statements.join(', ')});
  Assert.assertSame(mvRet, mv);
}

@Test
public void ${methodName}_noUser() {
  super.createNoPersonExpectations();
  ${controllerName} controller = createController();
  ModelAndView mv = controller.${methodName}(${statements.join(', ')});
  super.validateModelAndViewIsUnAuthorized(mv);
}`;

  // Set the test cases as the result
  var resultContainer = $('#result');
  resultContainer.html('<code>' + testCase + '</code><br><button id="copyButton" onclick="copyCode()">Copy</button>');
}

function generateTestCasesForClassObjRet() {
  var methodName = $('#methodName').val();
  var classNames = $('#classNames').val();
  var classValues = $('#classValues').val();
  var controllerName = $('#controllerName').val();
  var returnValue = $('#returnValue').val();

  // Check if all required fields are filled
  if (!methodName || !classNames || !classValues || !controllerName || !returnValue) {
    alert('Please fill in all the required fields.');
    return;
  }

  // Split the class names and generate statements for each class
  var classNamesArray = classNames.split(',');
  var classValuesArray = classValues.split(',');
  var statements = [];
  for (var i = 0; i < classNamesArray.length; i++) {
    var className = classNamesArray[i].trim();
    var classNameSmall = className.toLowerCase();
    var classValue = classValuesArray[i].trim();
    var statement = className + ' ' + classNameSmall + ' = learningService.loadEntity(' + className + '.class, "' + classValue + '");';
    statements.push(statement);
  }

  // Generate the test cases
  var testCase = `
@Test
public void ${methodName}_works() {
  Person person = super.createTnlAdmin();
  ${statements.join('\n    ')}
  super.createPersonExpectations(person);
  ModelAndView mvRet = new ModelAndView();
  ${controllerName} controller = createController();
  when(sessionService.getSessionPerson()).thenReturn(person);
  final TestHtmlHelper html = new TestHtmlHelper();
  PdsHelper h = mock(PdsHelper.class);
  html.setPdsHelper_TESTONLY(h);
  when(${returnValue}).thenReturn(mvRet);
  ModelAndView mv = controller.${methodName}(Long.parseLong("${classValuesArray[0]}"));
  Assert.assertSame(mvRet, mv);
}

@Test
public void ${methodName}_noUser() {
  super.createNoPersonExpectations();
  ${controllerName} controller = createController();
  ModelAndView mv = controller.${methodName}(Long.parseLong("${classValuesArray[0]}"));
  super.validateModelAndViewIsUnAuthorized(mv);
}`;

  // Set the test cases as the result
  var resultContainer = $('#result');
  resultContainer.html('<code>' + testCase + '</code><br><button id="copyButton" onclick="copyCode()">Copy</button>');
}

function copyCode() {
  var codeSnippet = $('#result code')[0];
  var range = document.createRange();
  range.selectNode(codeSnippet);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  alert('Code snippet copied to clipboard!');
}

$(document).ready(function () {
  // Hide the card initially
  $('.card').hide();
	$('#result').hide();

  // Show/hide card and load script based on dropdown selection
  $('#dropdown').on('change', function () {
    // Clear the result container
    $('#result').empty();

    var selectedValue = $(this).val();

    if (selectedValue === 'longIdRet') {
      $('.card').show();
      $('.class-names').hide();
    } else if (selectedValue === 'classObjRet') {
      $('.card').show();
      $('.class-names').show();
    }
  });
});

