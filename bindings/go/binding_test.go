package tree_sitter_tbd_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tbd "github.com/tbd-lang/tree-sitter-tbd/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tbd.Language())
	if language == nil {
		t.Errorf("Error loading Tbd grammar")
	}
}
