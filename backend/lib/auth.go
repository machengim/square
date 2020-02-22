package lib

import (
	"fmt"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

var secret = "unicorn"

func GetToken() string {
	token := jwt.New(jwt.GetSigningMethod("HS256"))
	token.Claims = jwt.MapClaims{
		"id":  1,
		"exp": time.Now().Add(time.Hour * 1).Unix(),
	}

	tokenString, err := token.SignedString([]byte(secret))
	ErrLog(err)
	fmt.Println(tokenString)
	return tokenString
}

func CheckToken(tokenString string) bool {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["exp"], " and id is ", claims["id"])
	} else {
		fmt.Println("Error:", err)
	}

	return true
}
