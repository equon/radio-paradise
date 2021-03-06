package main

import (
	"github.com/joho/godotenv"
	"github.com/labstack/echo"
	"net/http"
	"os"
	"radio-paradise"
)

func NowPlaying(c *echo.Context) error {
	recent, err := radioparadise.RecentSongs()
	if err != nil {
		return err
	}

	return c.JSONP(http.StatusOK, c.Query("callback"), &struct {
		Songs []*radioparadise.Song `json:"songs"`
	}{
		recent,
	})
}

func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	if err := radioparadise.OpenDB(); err != nil {
		panic(err)
	}

	radioparadise.MigrateDB()

	go radioparadise.StayUpdated()

	e := echo.New()
	e.Static("/", "ui/public")
	e.Get("/api/now", NowPlaying)
	e.Run(os.Getenv("ADDR"))
}
