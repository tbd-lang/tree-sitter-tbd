import XCTest
import SwiftTreeSitter
import TreeSitterTbd

final class TreeSitterTbdTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tbd())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Tbd grammar")
    }
}
