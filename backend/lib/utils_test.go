package lib

import (
	"fmt"
	"testing"
)

func TestReadConfig(t *testing.T) {
	path := "../assets/config.json"

	var expected = Config{"localhost", 5432, "square",
		"qwer1234", "test", 5}

	config, err := ReadConfig(path)
	if err != nil {
		fmt.Print(err)
		return
	}
	if config != expected {
		t.Errorf("Expected %v", expected)
		t.Errorf("Got %v", config)
	}
}
