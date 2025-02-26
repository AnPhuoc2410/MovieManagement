import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Input,
} from "@mui/material";

interface Word {
  kanji: string;
  hiragana: string;
  meaning: string;
}

const JapaneseQuiz: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [onyomi, setOnyomi] = useState<string>("");
  const [kunyomi, setKunyomi] = useState<string>("");
  const [meaning, setMeaning] = useState<string | null>(null);
  const [kanjiAnimation, setKanjiAnimation] = useState<string[]>([]);
  const [example, setExample] = useState<{
    japanese: string;
    meaning: string;
    audio: string;
  } | null>(null);

  const fetchGoogleSheet = async () => {
    const url =
      "https://docs.google.com/spreadsheets/d/1Q1s9lvWIHrGwEWt96p9MusunwNuUES5QnZA5kDVfKbM/gviz/tq?tqx=out:csv&gid=503983452";

    try {
      const response = await fetch(url);
      const text = await response.text();

      const rows = text
        .split("\n")
        .map(
          (row) =>
            row.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim()), // Remove quotes
        )
        .filter((row) => row.length > 2 && row[1] && row[2]); // Ensure valid data

      if (rows.length > 1) {
        const formattedWords = rows.slice(1).map((row) => ({
          kanji: row[1],
          hiragana: row[2],
          meaning: row[3] || "N/A",
        }));

        setWords(formattedWords);
      } else {
        console.error("No valid data found in Google Sheet");
      }
    } catch (error) {
      console.error("Error fetching Google Sheet:", error);
    }
  };

  useEffect(() => {
    fetchGoogleSheet();
  }, []);

  const fetchKanjiDetails = async (kanji: string) => {
    try {
      const response = await fetch(
        `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${kanji}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Host": "kanjialive-api.p.rapidapi.com",
            "X-RapidAPI-Key":
              "3837d9f885msh5b586904f09211ep1cb7c2jsnc56232b3a963",
          },
        },
      );

      const data = await response.json();
      console.log("Kanji API Response:", data);

      setOnyomi(data.kanji?.onyomi?.katakana || "N/A");
      setKunyomi(data.kanji?.kunyomi?.hiragana || "N/A");
      setKanjiAnimation(data.radical?.animation || []);

      const exampleData = data.examples?.[0];
      if (exampleData) {
        setExample({
          japanese: exampleData.japanese,
          meaning: exampleData.meaning.english,
          audio: exampleData.audio?.mp3 || "",
        });
      } else {
        setExample(null);
      }
    } catch (error) {
      console.error("Error fetching Kanji details:", error);
      setKanjiAnimation([]);
    }
  };

  const checkAnswer = () => {
    if (words.length === 0) return;

    if (input.trim() === words[index].hiragana) {
      setMessage("✅ Đúng!");
    } else {
      setMessage(`❌ Sai! Đáp án: ${words[index].hiragana}`);
    }

    // Show meaning after checking
    setMeaning(words[index].meaning);

    // Fetch Kanji details
    fetchKanjiDetails(words[index].kanji);
  };

  const nextWord = () => {
    if (words.length === 0) return;
    setIndex((prev) => (prev + 1) % words.length);
    setInput("");
    setMessage("");
    setMeaning(null); // Hide meaning until answer is checked
    setOnyomi("");
    setKunyomi("");
    setKanjiAnimation([]);
    setExample(null);
  };

  const prevWord = () => {
    if (words.length === 0) return;
    if (prev == 0) return;
    setIndex((prev) => (prev - 1) % words.length);
    setInput("");
    setMessage("");
    setMeaning(null); // Hide meaning until answer is checked
    setOnyomi("");
    setKunyomi("");
    setKanjiAnimation([]);
    setExample(null);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: 50 }}>
      <Input type="file" disabled />{" "}
      {/* File upload removed since we're using Google Sheets */}
      {words.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {words[index].kanji}
            </Typography>

            {meaning && (
              <Typography variant="h6">Ý nghĩa: {meaning}</Typography>
            )}

            {kanjiAnimation.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "5px",
                  marginBottom: 10,
                }}
              >
                {kanjiAnimation.map((frame, idx) => (
                  <img
                    key={idx}
                    src={frame}
                    alt={`Stroke ${idx}`}
                    style={{ width: 50, height: 50 }}
                  />
                ))}
              </div>
            )}

            {example && (
              <div>
                <Typography variant="body1">
                  Ví dụ: {example.japanese} ({example.meaning})
                </Typography>
                {example.audio && (
                  <audio controls>
                    <source src={example.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )}

            <TextField
              label="Nhập Hiragana"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              style={{ marginBottom: 20 }}
            />
            <Typography variant="h6" color="primary">
              {message}
            </Typography>
            <Button variant="outlined" color="info" onClick={prevWord}>
              Từ trước đó
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={checkAnswer}
              style={{ marginRight: 10, marginLeft: 10 }}
            >
              Kiểm tra
            </Button>
            <Button variant="outlined" color="secondary" onClick={nextWord}>
              Từ tiếp theo
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default JapaneseQuiz;
