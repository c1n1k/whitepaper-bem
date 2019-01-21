function colspanGenerate(root) {
  const mods = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

  root.walkRules(rule => {
    // Transform each rule here
    rule.walkDecls(decl => {
      if (decl.prop === 'colspan') {
        mods.forEach(mod => {
          const allCols = 12;
          let i = decl.value;
          while (i < allCols) {
            i++;

            const rule = postcss.rule({
              selector: `&_${mod}-col_${decl.value}`
            });

            const mediaRuleMin = postcss.atRule({
              name: 'media',
              params: `(min-width: screen-${mod})`
            });

            const mediaRuleMax = postcss.atRule({
              name: 'media',
              params: `(max-width: screen-${mod}-max)`
            });

            rule.append({
              type: 'decl',
              prop: 'lost-column',
              value: decl.value + '/' + i,
              raws: {
                before: '\n\t\t',
                between: ': '
              }
            });

            const cloneRuleMin = rule.clone();
            const cloneRuleMax = rule.clone();

            mediaRuleMin.append(cloneRuleMin);
            mediaRuleMax.append(cloneRuleMax);

            decl.after(mediaRuleMin);
            decl.after(mediaRuleMax);
            decl.after(rule);
          }
        });
        //decl.replaceWith(rules);
        decl.remove();
      }
    });
  });
}
