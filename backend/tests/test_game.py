import unittest

from app.main import AttemptRequest, Game, evaluate, games, normalize_word, submit_attempt


class GameTests(unittest.TestCase):
    def tearDown(self):
        games.clear()

    def test_normalization_preserves_enye(self):
        self.assertEqual(normalize_word("ÁRBOL"), "arbol")
        self.assertEqual(normalize_word("NIÑO"), "niño")

    def test_repeated_letters_are_counted_once(self):
        self.assertEqual(evaluate("cacao", "acaaa"), [1, 1, 0, 2, 0])

    def test_games_are_isolated_and_answer_is_only_revealed_at_end(self):
        games["one"] = Game("cacao", "es")
        games["two"] = Game("cacao", "es")

        response = submit_attempt("one", AttemptRequest(word="cacao"))

        self.assertEqual(response["status"], "won")
        self.assertEqual(response["correct_word"], "cacao")
        self.assertEqual(games["two"].attempts, 0)


if __name__ == "__main__":
    unittest.main()
