package models

import (
	"reflect"

	log "github.com/sirupsen/logrus"
)

type Model interface {
}

// op == 0 means getting values, op==1 means getting fields name, op==2 means getting fields address
func Reflect(model interface{}, op int) []interface{} {
	log.Debug("op == ", op)
	getType := reflect.TypeOf(model)
	getValue := reflect.ValueOf(model)
	var results []interface{}
	var v interface{}
	for i := 0; i < getType.NumField(); i++ {
		if op == 0 {
			v = getValue.Field(i).Interface()
		} else if op == 1 {
			v = getType.Field(i).Name
		} else {
			// This part of code has some problems.
			t := reflect.ValueOf(model).Elem()
			v = t.Field(i).Addr().Interface()
		}
		log.Debug("v == ", v)
		results = append(results, v)
	}

	return results
}
