// 1. 화면에 있는 'data-value'라는 속성을 가진 모든 select 태그를 찾아서 하나씩 살펴봄
$('select[data-value]').each(function(index, el) {
    // 현재 순서의 select 엘리먼트를 제이쿼리 객체로 변환함
    const $el = $(el);

    // 태그에 적힌 'data-value' 속성값(미리 선택되어야 할 값)을 가져오고 공백을 제거함
    defaultValue = $el.attr('data-value').trim();

    // 만약 data-value에 적힌 값이 비어있지 않다면(글자 길이가 0보다 크면)
    if (defaultValue.length > 0) {
        // 해당 select 박스의 선택값을 그 데이터값으로 강제로 설정함
        $el.val(defaultValue);
    }
});