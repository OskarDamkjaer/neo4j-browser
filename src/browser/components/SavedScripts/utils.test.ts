import { getScriptDisplayName } from './utils'

describe('saved-scripts.utils', () => {
  describe('getScriptDisplayName', () => {
    const scriptNoNameNoCommentSingleLine = {
      content: 'Foo bar'
    }
    const scriptNoNameNoCommentMultiLine = {
      content: 'Foo bar\nBar baz'
    }
    const scriptNoNameWithComment = {
      content: '//Comment\nBar baz'
    }
    const scriptNoNameWithCommentWhiteSpace = {
      content: '//   Comment\nBar baz'
    }
    const scriptWithNameNoComment = {
      content: 'Bar baz'
    }
    const scriptWithNameAndComment = {
      content: '//donkey\nBar baz'
    }

    test('Uses content as name when nothing else available', () => {
      expect(getScriptDisplayName(scriptNoNameNoCommentSingleLine)).toBe(
        'Foo bar'
      )
    })

    test('Uses only first line of content', () => {
      expect(getScriptDisplayName(scriptNoNameNoCommentMultiLine)).toBe(
        'Foo bar'
      )
    })

    test('Uses comment as name when available', () => {
      expect(getScriptDisplayName(scriptNoNameWithComment)).toBe('Comment')
    })

    test('Uses comment as name when available, stripping leading whitespace', () => {
      expect(getScriptDisplayName(scriptNoNameWithCommentWhiteSpace)).toBe(
        'Comment'
      )
    })

    test('Uses name as name when available', () => {
      expect(getScriptDisplayName(scriptWithNameNoComment)).toBe('Apa')
    })

    test('Uses name as name even when comment is available', () => {
      expect(getScriptDisplayName(scriptWithNameAndComment)).toBe('Apa')
    })
  })
})
