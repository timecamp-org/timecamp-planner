import { renderHook, act } from '@testing-library/react-hooks';
import { List, is } from 'immutable';

import useLazyList from '../useLazyList';

const container1Id = 'container::1';
const container2Id = 'container::2';

let source1ItemIds = new List();
let source2ItemIds = new List();

const delay = (timeout) =>
  new Promise((resolve, reject) => {
    if (timeout === null || timeout === undefined) {
      reject();
    }
    setTimeout(resolve, timeout);
  });

for (let i = 0; i < 45; i++) {
  source1ItemIds = source1ItemIds.push(`item_s1::${i}`);
}

for (let i = 0; i < 23; i++) {
  source2ItemIds = source2ItemIds.push(`item_s2::${i}`);
}

describe('useLazyList', () => {
  it('should slice source items to chunks', async () => {
    const { result } = renderHook(() =>
      useLazyList(source1ItemIds, container1Id, 5)
    );

    await act(async () => {
      await delay(200);
    });

    const { slicedItemIds } = result.current;
    const areListsEqual = is(slicedItemIds, source1ItemIds);
    expect(areListsEqual).toBeTruthy();
  });
  it('should reload items from other container', async () => {
    let sourceItemIds = source1ItemIds;
    let containerId = container1Id;
    const { result, rerender } = renderHook(() =>
      useLazyList(sourceItemIds, containerId, 5)
    );

    await act(async () => {
      await delay(200);
      containerId = container2Id;
      sourceItemIds = source2ItemIds;
      rerender();
      await delay(200);
    });

    const { slicedItemIds } = result.current;
    const areListsEqual = is(slicedItemIds, source2ItemIds);
    expect(areListsEqual).toBeTruthy();
  });
});
