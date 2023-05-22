
        function generateTestCases() {
            var methodName = document.getElementById('methodName').value;
            var classNames = document.getElementById('classNames').value;
            var classValues = document.getElementById('classValues').value;
            var controllerName = document.getElementById('controllerName').value;
            var returnValue = document.getElementById('returnValue').value;

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
            var resultContainer = document.getElementById('result');
            resultContainer.innerHTML = '<code>' + testCase + '</code><br><button id="copyButton" onclick="copyCode()">Copy</button>';

            // Clear the input fields
            document.getElementById('methodName').value = '';
            document.getElementById('classNames').value = '';
            document.getElementById('classValues').value = '';
            document.getElementById('controllerName').value = '';
            document.getElementById('returnValue').value = '';
        }

        function copyCode() {
            var codeSnippet = document.querySelector('#result code');
            var range = document.createRange();
            range.selectNode(codeSnippet);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            alert('Code snippet copied to clipboard!');
        }
		