<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage/index.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList" :panel-list="panelList" @PanelChange="onPanelChange">
    <template #link="{ configProps }"><t-link v-bind="configProps"> 跳转链接 </t-link></template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { ref, onMounted } from 'vue';
import configJson from './props.json';

const configList = ref(configJson);
const panelList = [{ label: 'link', value: 'link' }];

const usageCodeMap = { link: '<t-link v-bind="configProps"> 跳转链接 </t-link>' };
const usageCode = ref(`<template>${usageCodeMap[panelList[0].value].trim()}</template>`);

function onPanelChange(panel) {
  usageCode.value = `<template>${usageCodeMap[panel].trim()}</template>`;
}
</script>
