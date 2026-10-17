import assert from 'assert';
import {
  BUSINESS_CATEGORIES,
  getCategoryDefaults,
  isValidCategory,
} from '../../src/utils/category.util.js';

describe('category.util', () => {
  it('includes the expected category ids', () => {
    const ids = BUSINESS_CATEGORIES.map((category) => category.id);
    assert.ok(ids.includes('technology'));
    assert.ok(ids.includes('finance'));
    assert.ok(ids.includes('healthcare'));
    assert.ok(ids.includes('other'));
  });

  it('returns a dark blue palette for technology', () => {
    const defaults = getCategoryDefaults('technology');
    assert.strictEqual(defaults.palette.primary, '#0f172a');
    assert.strictEqual(defaults.palette.background, '#1e293b');
    assert.strictEqual(typeof defaults.themeId, 'string');
  });

  it('falls back to other for unknown ids', () => {
    assert.strictEqual(isValidCategory('not-a-category'), false);
    const defaults = getCategoryDefaults('not-a-category');
    assert.strictEqual(defaults.palette.primary, '#182d30');
  });
});
