import React from 'react';

import { Flex } from '../shared/semi/Flex';

export function ProductHunt() {
  return (
    <Flex align="center" m="2rem 0">
      <a
        href="https://www.producthunt.com/posts/moon-finder?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-moon&#0045;finder"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=628321&theme=light"
          alt="moon&#0032;finder - Little&#0032;page&#0032;that&#0032;helps&#0032;you&#0032;find&#0032;the&#0032;moon&#0046; | Product Hunt"
          style={{ width: 250, height: 54 }}
        />
      </a>
    </Flex>
  );
}
