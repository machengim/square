package models

import (
	log "github.com/sirupsen/logrus"
	"square/lib"
)

type Mark struct {
	Id		int		`json:"id"`
	Pid		int		`json:"pid"`
	Uid		int		`json:"uid"`
}

func (mark Mark) Create() (int, error) {
	columns := []string{"pid", "uid"}
	values := []interface{} {mark.Pid, mark.Uid}
	_, err := lib.CreateEntry(lib.Conn, "mark", columns, values)
	if err != nil {
		return -1 ,err
	}

	row, err := lib.QuerySingle(lib.Conn, "mark", columns, values)
	if err != nil {
		return -1 ,err
	}
	err = row.Scan(&mark.Id, &mark.Uid, &mark.Pid)
	if err != nil {
		return -1 ,err
	}

	user, _ := RetrieveUserById(lib.Conn, mark.Uid)
	user.Marks += 1
	user.UpdateById(lib.Conn)
	return mark.Id, nil
}

func GetMarkIdByInfo(uid int,pid int) (int, error)  {
	columns := []string{"uid", "pid"}
	values := []interface{}{uid, pid}
	row, err := lib.QuerySingle(lib.Conn, "mark", columns, values)
	if err != nil {
		log.Error("Error when quering mark: ", err)
		return -1, err
	}

	var mark Mark
	err = row.Scan(&mark.Id, &mark.Uid, &mark.Pid)
	if err != nil{
		return -1, err
	}
	return mark.Id, nil
}