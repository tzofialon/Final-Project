

        // האזנה לשליחת טופס ההרשמה
        document.getElementById("registerForm")
            .addEventListener(
                "submit",
                async function(event) {


                    // מונע מהדף להתרענן אוטומטית
                    event.preventDefault();


                    // שמירת הפרטים שהוזנו באובייקט
                    // כדי לשלוח אותם לשרת
                    const user = {

                        username:
                            document.getElementById("username").value,

                        email:
                            document.getElementById("email").value,

                        password:
                            document.getElementById("password").value
                    };


                    // שליחת פרטי המשתמש החדש לשרת
                    const response =
                        await fetch(
                            "http://localhost:3000/register",
                            {

                                // POST = שליחת מידע לשרת
                                method: "POST",

                                // המידע נשלח בפורמט JSON
                                headers: {
                                    "Content-Type": "application/json"
                                },

                                // המרת האובייקט ל-JSON ושליחתו
                                body: JSON.stringify(user)
                            }
                        );


                    // קבלת התשובה מהשרת כטקסט
                    const message =
                        await response.text();


                    // הצגת תשובת השרת למשתמש
                    alert(message);

                }
            );


